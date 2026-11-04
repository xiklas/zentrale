<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="chat-header">
      <div class="bot-avatar">Z</div>
      <div class="header-info">
        <h2>Zentrale Kleve</h2>
      </div>
    </div>

    <!-- Nachrichten-Bereich -->
    <div class="messages-area" ref="messagesArea">
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        :class="['message-row', msg.sender]"
      >
        <div class="message-content">
          <div class="sender-name">{{ msg.sender === 'user' ? 'Du' : 'Zentrale' }}</div>
          <div class="text-bubble markdown-body" v-html="renderMarkdown(msg.text)"></div>
        </div>
      </div>

      <!-- Lade-Indikator -->
      <div v-if="isLoading" class="message-row bot">
        <div class="message-content">
          <div class="sender-name">Zentrale</div>
          <div class="text-bubble typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Eingabe-Bereich -->
    <div class="input-container">
      <form class="input-box" @submit.prevent="sendMessage">
        <input 
          v-model="inputQuery" 
          type="text" 
          placeholder="Stelle eine Frage..."
          :disabled="isLoading"
          autocomplete="off"
          enterkeyhint="send"
        />
        <button type="submit" :disabled="!inputQuery.trim() || isLoading" aria-label="Senden">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
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

const messages = ref([
  {
    id: 1,
    sender: 'bot',
    text: 'hey, worauf hast du heute Lust?'
  }
])

const renderMarkdown = (text) => {
  return marked(text || '')
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesArea.value) {
    messagesArea.value.scrollTo({
      top: messagesArea.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

const sendMessage = async () => {
  if (!inputQuery.value.trim() || isLoading.value) return

  const userText = inputQuery.value

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
/* Reset & Basis-Layout für perfekte Mobile-Skalierung */
.chat-container {
  width: 100%;
  max-width: 768px;
  height: 100dvh; /* Nutzt die echte dynamische Bildschirmhöhe auf dem Smartphone */
  max-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background-color: #212121;
  color: #ececec;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

@media (min-width: 768px) {
  .chat-container {
    height: 85vh;
    max-height: 900px;
    border-radius: 12px;
    border: 1px solid #2f2f2f;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    margin: 2rem auto;
  }
}

/* Header */
.chat-header {
  padding: 0.875rem 1rem;
  background-color: #212121;
  border-bottom: 1px solid #2f2f2f;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  z-index: 10;
}

.bot-avatar {
  width: 32px;
  height: 32px;
  background-color: #ffffff;
  color: #000000;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.header-info h2 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ececec;
}

.status {
  font-size: 0.75rem;
  color: #888888;
}

/* Nachrichten-Bereich mit nativem Touch-Scroll */
.messages-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.message-row {
  display: flex;
  padding: 0.875rem 1rem;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

@media (min-width: 768px) {
  .message-row {
    padding: 1rem 1.5rem;
  }
}

.message-row.bot {
  background-color: #212121;
}

.message-row.user {
  background-color: #1a1a1a;
}

.message-content {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
  text-align: left;
}

.sender-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #888888;
}

/* Linksbündiger Markdown-Inhalt */
.markdown-body {
  font-size: 0.95rem;
  line-height: 1.55;
  color: #ececec;
  text-align: left !important;
  width: 100%;
  word-break: break-word;
}

.markdown-body p {
  margin: 0 0 0.5rem 0;
  text-align: left !important;
}

.markdown-body p:last-child {
  margin-bottom: 0;
}

.markdown-body strong {
  color: #ffffff;
  font-weight: 600;
}

.markdown-body ul, 
.markdown-body ol {
  margin: 0.4rem 0;
  padding-left: 1.25rem;
  text-align: left !important;
}

.markdown-body li {
  margin-bottom: 0.25rem;
  text-align: left !important;
}

/* Eingabebereich mit Safe Area Abfangung für moderne Smartphones */
.input-container {
  padding: 0.75rem 1rem;
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
  background-color: #212121;
  border-top: 1px solid #2f2f2f;
  flex-shrink: 0;
  z-index: 10;
}

@media (min-width: 768px) {
  .input-container {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
  }
}

.input-box {
  display: flex;
  align-items: center;
  background-color: #2f2f2f;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 0.35rem 0.35rem 0.35rem 0.875rem;
  transition: border-color 0.2s;
}

.input-box:focus-within {
  border-color: #717171;
}

.input-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: #ececec;
  font-size: 0.95rem;
  outline: none;
  padding: 0.5rem 0;
}

.input-box input::placeholder {
  color: #717171;
}

.input-box button {
  background-color: #ffffff;
  color: #000000;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.input-box button:disabled {
  background-color: #424242;
  color: #717171;
  cursor: not-allowed;
}

/* Tipp-Animation */
.typing {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 24px;
}

.typing span {
  width: 6px;
  height: 6px;
  background-color: #888;
  border-radius: 50%;
  animation: blink 1.4s infinite both;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0% { opacity: .2; }
  20% { opacity: 1; }
  100% { opacity: .2; }
}
</style>