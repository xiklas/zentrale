<template>
  <div class="chat-page" :style="viewportStyle">
    <div class="chat-container">

      <!-- Header: nur Zurück-Pfeil -->
      <header class="chat-header">
        <a href="/" class="back-link" aria-label="Zurück zur Startseite">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </a>
      </header>

      <!-- Nachrichten-Bereich -->
      <main class="messages-area" ref="messagesArea" aria-live="polite">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message-row', msg.sender]"
        >
          <!-- Eigene Nachrichten als reiner Text (kein HTML) -->
          <div v-if="msg.sender === 'user'" class="bubble user-bubble">{{ msg.text }}</div>
          <!-- Antworten der Bar als Markdown -->
          <div v-else class="bubble bot-bubble markdown-body" v-html="renderMarkdown(msg.text)"></div>
        </div>

        <!-- Lade-Indikator -->
        <div v-if="isLoading" class="message-row bot">
          <div class="bubble bot-bubble typing" aria-label="Zentrale schreibt">
            <span></span><span></span><span></span>
          </div>
        </div>
      </main>

      <!-- Beispiel-Prompts: direkt über dem Eingabefeld (Daumen-Nähe), nur vor der ersten Frage -->
      <div v-if="showSuggestions" class="suggestions">
        <p class="suggestions-title">Zum Beispiel</p>
        <button
          v-for="s in visibleSuggestions"
          :key="s.label"
          type="button"
          class="chip"
          :disabled="isLoading"
          @click="sendMessage(s.text)"
        >
          {{ s.label }}
        </button>
      </div>

      <!-- Eingabe-Bereich -->
      <div class="input-container">
        <form class="input-box" @submit.prevent="sendMessage()">
          <input
            v-model="inputQuery"
            type="text"
            placeholder="Stelle eine Frage..."
            aria-label="Deine Frage"
            autocomplete="off"
            enterkeyhint="send"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
          />
          <!-- mousedown.prevent: Tastatur bleibt beim Senden geöffnet -->
          <button
            type="submit"
            :disabled="!inputQuery.trim() || isLoading"
            aria-label="Senden"
            @mousedown.prevent
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'

// Markdown Konfiguration für saubere Darstellung
marked.setOptions({
  gfm: true,
  breaks: true
})

const inputQuery = ref('')
const isLoading = ref(false)
const messagesArea = ref(null)

const FUNCTION_URL = 'https://europe-west1-zentrale-kleve-app.cloudfunctions.net/chat'

// Pool der Beispiele: label = Text auf dem Button, text = Frage an den Barkeeper
const suggestions = [
  { label: 'Rotwein', text: 'Welche Rotweine habt ihr?' },
  { label: 'Weißwein', text: 'Welche Weißweine habt ihr?' },
  { label: 'Alkoholfreie Getränke', text: 'Welche alkoholfreien Getränke habt ihr?' },
  { label: 'Cocktails', text: 'Welche Cocktails habt ihr?' },
  { label: 'Longdrinks', text: 'Welche Longdrinks habt ihr?' },
  { label: 'Bier', text: 'Welche Biere habt ihr?' },
  { label: 'Gin & Tonic', text: 'Welche Gin & Tonics habt ihr?' },
  { label: 'Whisky', text: 'Welche Whiskys habt ihr?' },
  { label: 'Snacks', text: 'Welche Snacks habt ihr?' }
]

// Zufällig n Einträge auswählen (Fisher-Yates)
const pickRandom = (list, n) => {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

// Wird einmal beim Laden der Seite gewürfelt (max. 3 Beispiele)
const visibleSuggestions = ref(pickRandom(suggestions, 3))
const inputFocused = ref(false)

const messages = ref([
  {
    id: 1,
    sender: 'bot',
    text: 'hey, worauf hast du heute Lust?'
  }
])

// Beispiele nur vor der ersten Frage zeigen und ausblenden, solange getippt wird
// (spart Platz, wenn die Tastatur offen ist)
const showSuggestions = computed(() => messages.value.length === 1 && !inputFocused.value)

const renderMarkdown = (text) => {
  return marked(text || '')
}

const scrollToBottom = async (smooth = true) => {
  await nextTick()
  if (messagesArea.value) {
    messagesArea.value.scrollTo({
      top: messagesArea.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
}

// Mobile: Layout an den sichtbaren Bereich anpassen (Tastatur öffnet/schließt)
const viewportStyle = ref({})

const updateViewport = () => {
  const vv = window.visualViewport
  if (!vv) return
  viewportStyle.value = {
    height: `${vv.height}px`,
    top: `${vv.offsetTop}px`
  }
}

const onViewportResize = () => {
  updateViewport()
  scrollToBottom(false)
}

onMounted(() => {
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onViewportResize)
    window.visualViewport.addEventListener('scroll', updateViewport)
  }
})

onUnmounted(() => {
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', onViewportResize)
    window.visualViewport.removeEventListener('scroll', updateViewport)
  }
})

// preset: optionaler Text (z. B. von einem Beispiel-Button)
const sendMessage = async (preset) => {
  const userText = (typeof preset === 'string' ? preset : inputQuery.value).trim()
  if (!userText || isLoading.value) return

  messages.value.push({
    id: Date.now(),
    sender: 'user',
    text: userText
  })

  inputQuery.value = ''
  isLoading.value = true
  await scrollToBottom()

  const apiMessages = messages.value.map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text
  }))

  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages })
    })

    const data = await res.json()

    messages.value.push({
      id: Date.now() + 1,
      sender: 'bot',
      text: data.reply || 'Entschuldige, da gab es ein Missverständnis.'
    })
  } catch (err) {
    console.error('Fehler:', err)
    messages.value.push({
      id: Date.now() + 1,
      sender: 'bot',
      text: 'Ups, da ist die Verbindung zur Bar kurz abgebrochen.'
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped>
/* ---------- Seite & Container (wie die Startseite: weiß, schwarz, sans-serif) ---------- */
.chat-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: #ffffff;
  color: #000000;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.chat-container {
  width: 100%;
  max-width: 640px;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ---------- Header ---------- */
.chat-header {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  padding-top: calc(4px + env(safe-area-inset-top, 0px));
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

/* 44x44 px Tippfläche */
.back-link {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.back-link:active {
  opacity: 1;
}

/* ---------- Nachrichten ---------- */
.messages-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 16px 12px 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row.user {
  justify-content: flex-end;
}

.message-row.bot {
  justify-content: flex-start;
}

.bubble {
  max-width: 85%;
  padding: 12px 16px;
  font-size: 1rem;
  line-height: 1.5;
  overflow-wrap: break-word;
  text-align: left; /* nicht von globalem text-align: center erben */
  box-sizing: border-box;
}

.bot-bubble {
  max-width: 100%; /* Antworten (Listen!) bekommen die volle Breite */
  padding: 12px 14px;
  background-color: #f2f2f2;
  color: #000000;
  border-radius: 20px 20px 20px 6px;
}

.user-bubble {
  background-color: #000000;
  color: #ffffff;
  border-radius: 20px 20px 6px 20px;
  white-space: pre-wrap;
}

/* Markdown-Inhalt in den Antworten */
.markdown-body :deep(p) {
  margin: 0 0 0.5rem 0;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(strong) {
  font-weight: 600;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0.4rem 0;
  padding-left: 1.1rem;
}

.markdown-body :deep(li) {
  margin-bottom: 0.25rem;
}

.markdown-body :deep(a) {
  color: #000000;
  text-decoration: underline;
}

/* ---------- Beispiel-Prompts ---------- */
.suggestions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* rechtsbündig wie eigene Nachrichten */
  gap: 8px;
  padding: 8px 16px 12px 16px;
}

.suggestions-title {
  margin: 0 0 2px 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
  opacity: 0.5;
}

.chip {
  font-family: sans-serif;
  font-size: 0.8rem;
  font-weight: 350;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #000000;
  background-color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: 9999px;
  min-height: 44px;
  padding: 0 18px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.chip:active {
  background-color: #000000;
  color: #ffffff;
}

.chip:disabled {
  opacity: 0.4;
  cursor: default;
}

@media (hover: hover) {
  .chip:hover:not(:disabled) {
    background-color: #000000;
    color: #ffffff;
  }
}

/* ---------- Eingabe ---------- */
.input-container {
  flex-shrink: 0;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.input-box {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 6px 0 20px;
  background-color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: 9999px;
  box-sizing: border-box;
}

.input-box input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #000000;
  font-family: sans-serif;
  /* mind. 16px, sonst zoomt iOS beim Antippen ins Feld */
  font-size: 16px;
}

.input-box input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.input-box button {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.input-box button:disabled {
  background-color: #e5e5e5;
  color: rgba(0, 0, 0, 0.35);
  cursor: default;
}

/* ---------- Tipp-Animation ---------- */
.typing {
  display: flex;
  gap: 5px;
  align-items: center;
  height: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
  box-sizing: content-box;
}

.typing span {
  width: 7px;
  height: 7px;
  background-color: #000000;
  border-radius: 50%;
  animation: blink 1.4s infinite both;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
</style>