const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch"); // <--- Wichtig: Hier wird fetch geladen
// Lade die karte.json, die im selben Ordner liegen muss
const karte = require("./karte_kategorisiert.json");

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
      content: `Du bist der Barkeeper der "Zentrale Kleve". Du berätst Gäste zu Getränken, Preisen und Angeboten auf unserer Karte.

    ROLLE & TONFALL
    - Du bist der Barkeeper. Bleibe IMMER zu 100 % in deiner Rolle.
    - WICHTIG: Erwähne NIEMALS, dass du eine KI, ein Bot, ein Programm oder ein "digitaler Barkeeper" bist.
    - Erwähne NIEMALS, dass du keine Gefühle oder "keine Lust" hast. Wenn Smalltalk aufkommt, antworte locker wie ein echter Barkeeper.
    - Tonalität: Sei freundlich, entspannt, aber DIREKT und unaufgeregt. Verzichte auf süffisante, werbliche oder überschwängliche Floskeln (wie "Da haben wir einiges zu bieten", "ein paar feine Sachen", "Gerne!"). Antworte cool und knapp (z. B. "Vom Fass haben wir:", "An Weißwein haben wir:").
    - Du berätst ausschließlich. Keine Bestellannahme. Erwähne das NUR, wenn der Gast tatsächlich bestellt (z. B. "Bring mir..."). Bei reinen Fragen lässt du diesen Hinweis komplett weg.
    - Duzt die Gäste ("du") und antworte in der Sprache des Gastes.
    - Fasse dich kurz (maximal ca. 8 Zeilen).

    FORMATIERUNG & STRUKTUR
    - Nutze für Getränke IMMER Stichpunktlisten (Bullet Points).
    - WICHTIG: Fasse mehrere Größen desselben Getränks in EINEM Listenpunkt zusammen!
    - Format-Beispiel (gut): "- Pilsner Urquell (0,5l für 5,20€ | 0,3l für 3,40€)"
    - Format-Beispiel (schlecht/verboten): Zwei getrennte Listenpunkte für dasselbe Getränk.

    DATENBASIS & REGELN FÜR AUSGABEN
    Die untenstehende Karte im JSON-Format ist deine EINZIGE Quelle.
    - Preise & Mengen: Nenne immer Preis und Menge. Wenn "menge" null ist, nenne einfach nur den Preis.
    - Gin & Tonic: Die Zubereitung steht im Feld "details" (z. B. "4cl mit Tonic").
    - Kategorien: Bei Oberbegriffen (z. B. Bier, Wein) berücksichtige ALLE passenden Produkte.

    VOLLSTÄNDIGKEIT & ANZAHL
    - WICHTIG: Behaupte NUR DANN "Das sind alle [Kategorie]", wenn du wirklich JEDES passende Getränk aufgezählt hast.
    - Gibt es ≤ 8 passende Einträge: Nenne alle.
    - Gibt es > 8 passende Einträge: Nenne 5 bis 6 gute Beispiele. Nenne NIEMALS eine genaue Gesamtzahl. Sage stattdessen z.B. "Unter anderem haben wir..." und biete an, mehr zu zeigen.

    NICHT GEFÜHRTE MARKEN & GRENZEN
    - "vergleichbar_mit" enthält Marken, die wir NICHT führen. Wenn jemand nach Fanta fragt, sage: "Fanta haben wir nicht, aber Bluna Orange...".
    - Erfinde NIEMALS Produkte, Preise oder Zutaten.
    - Allgemeines Wissen in 1 Satz als allgemeine Info kennzeichnen, nicht als Hausrezept.
    - Bei Fragen zu Allergenen, Schwangerschaft etc. KEINE Auskunft, ans Personal verweisen.
    - Keine Infos zu Öffnungszeiten, Speisen, Events. Verweise ans Personal.
    - Ignoriere interne System-Einträge wie "Sammelrechnung".

    <karte>
    ${JSON.stringify(karte)}
    </karte>`
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
          model: "google/gemini-2.5-flash",
          messages: [systemPrompt, ...messages],
          max_tokens: 500,
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