const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch"); // <--- Wichtig: Hier wird fetch geladen
// Lade die karte.json, die im selben Ordner liegen muss
const karte = require("./karte.json");

exports.chat = onRequest(
  { 
    region: "europe-west1", 
    secrets: ["OPENROUTER_API_KEY"], 
    cors: true 
  },
  async (req, res) => {
    // CORS-Preflight-Anfragen direkt erlauben
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const systemPrompt = {
        role: "system",
        content: `Du bist der freundliche, informative digitale Barkeeper der "Zentrale Kleve". 
    Deine Aufgabe ist es, Gäste rein informativ und beratend über unsere Getränke, Preise und Angebote zu informieren.

    WICHTIGE REGELN:
    1. Tu NIEMALS so, als könntest du Getränke bringen, servieren oder Bestellungen aufnehmen. Du berätst ausschließlich.
    2. Wenn Gäste nach Allgemeinbegriffen wie "Rotwein", "Weißwein", "Bier" oder "Snacks" fragen, durchsuche die Karte auch nach konkreten Sorten, Marken und Rebsorten (z. B. Merlot, Primitivo, Pils, Alt, etc.) und liste diese passend auf.
    3. Nutze AUSSCHLIESSLICH die folgende Getränkekarte als Datenbasis:
    ${JSON.stringify(karte)}
    4. Wenn ein Getränk wirklich nicht auf der Karte oder ableitbar ist, teile sachlich mit, dass ihr das nicht führt. Erfinde niemals Preise oder Produkte!`
    };

    try {
      // Zugriff auf das Secret über process.env
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY secret is missing");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [systemPrompt, ...messages],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      const data = await response.json();

      if (data.error) {
        logger.error("OpenRouter API Error:", data.error);
        return res.status(500).json({ error: data.error.message || "OpenRouter error" });
      }

      const reply = data.choices?.[0]?.message?.content || "Entschuldige, ich habe dich nicht verstanden.";

      return res.status(200).json({ reply });
    } catch (error) {
      logger.error("Firebase Function Execution Error:", error);
      return res.status(500).json({ error: "Fehler beim Aufruf der KI: " + error.message });
    }
  }
);