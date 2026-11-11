<template>
  <div class="logo-container">
    
    <!-- Info-Banner -->
    <div v-if="alertMessage" class="alert-banner">
      {{ alertMessage }}
    </div>

    <!-- Hauptinhalt -->
    <div class="content-wrapper">
      
      <!-- Logo & Badge Gruppe (klebt nah beieinander) -->
      <div class="logo-group">
        <img src="/src/assets/zentrale-logo-upscaled.png" alt="Zentrale Logo" class="centered-logo" />
        <div v-if="isOpen" class="status-badge is-open">
          <span class="status-dot"></span>
          <span class="status-text">Jetzt geöffnet</span>
        </div>
      </div>

      <!-- Hauptaktion, darunter leise Zusatzlinks -->
      <div class="action-group">
        <a 
          href="https://zentrale-kleve.de/menu2" 
          class="menu-link"
        >
          Karte ansehen
        </a>

        <!-- Vorschläge je nach Uhrzeit (nur wenn geöffnet) -->
        <div v-if="chips.length" class="trending">
          <p class="trending-title">Highlights</p>
          <div class="trending-links">
            <template v-for="(c, i) in chips" :key="c.label">
              <span v-if="i > 0" class="dot" aria-hidden="true">·</span>
              <a :href="'/menu2#' + c.ziel" class="trend-link">{{ c.label }}</a>
            </template>
          </div>
        </div>

        <a href="https://zentrale-kleve.de/chat" class="ask-link">
          <span class="ask-muted">Unsicher?</span>
          <span class="ask-main">Stelle eine Frage</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>

      <!-- Öffnungszeiten: heute kompakt, Tipp zeigt alle -->
      <div class="opening-hours">
        <button
          type="button"
          class="hours-toggle"
          :aria-expanded="showHours"
          aria-controls="hours-panel"
          @click="showHours = !showHours"
        >
          <span class="hours-label">Heute</span>
          <span class="hours-today">{{ todayHours }}</span>
          <svg class="chevron" :class="{ open: showHours }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      <!-- Social & Kontakt Icons -->


    </div>

    <!-- Öffnungszeiten-Tabelle: liegt im Fluss unter dem Inhalt und schiebt nur die Fußzeile -->
    <div id="hours-panel" class="hours-panel" :class="{ open: showHours }">
      <div class="hours-panel-inner">
        <table class="hours-table">
          <tbody>
            <tr :class="{ 'active-row': activeDay === 'mo-do' }">
              <td>Mo – Do</td>
              <td>19:00 – 00:00</td>
            </tr>
            <tr :class="{ 'active-row': activeDay === 'fr-sa' }">
              <td>Fr & Sa</td>
              <td>19:00 – 01:00</td>
            </tr>
            <tr :class="{ 'active-row': activeDay === 'so' }">
              <td>So</td>
              <td>Geschlossen</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Fußzeile mit Impressum-Link -->
    <footer class="menu-footer">
            <div class="social-links">
        <!-- Navigation -->
        <a 
          href="https://maps.app.goo.gl/HHwcBRrMN5D7j8xY8" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Navigation"
          class="icon-link"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
        </a>

        <!-- Instagram -->
        <a 
          href="https://www.instagram.com/zentralekleve/" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Instagram"
          class="icon-link"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
      </div>
      <button @click="showImpressum = true" class="legal-link">Impressum</button>
    </footer>

    <!-- Impressum Overlay (Modal) -->
    <div v-if="showImpressum" class="modal-overlay" @click.self="showImpressum = false">
      <div class="modal-content">
        <button @click="showImpressum = false" class="close-button">&times;</button>
        <h2>Impressum</h2>
        
        <p><strong>Zentrale Gaststätte</strong></p>
        <p>Inhaber: Ralf Daute</p>
        <p>Gasthausstraße 16</p>
        <p>47533 Kleve</p>
        
        <p><strong>Kontakt:</strong></p>
        <p>Telefon: 02821-9780881</p>
        <p>E-Mail: info@zentrale-kleve.de</p>
        
        <p><strong>Zuständige Aufsichtsbehörde:</strong></p>
        <p>Ordnungsamt Kleve</p>
        <p>Landwehr 4–6, 47533 Kleve</p>
        
        <p><strong>Umsatzsteuer-ID:</strong></p>
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
        <p>DE334586674</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const alertMessage = ref('')
const showImpressum = ref(false)
const isOpen = ref(false)
const activeDay = ref('mo-do')
const showHours = ref(false)

// Öffnungszeit von "heute" für die kompakte Zeile
const todayHours = computed(() => ({
  'mo-do': '19:00 – 00:00',
  'fr-sa': '19:00 – 01:00',
  'so': 'Geschlossen'
})[activeDay.value])

// ---------- Vorschläge (Chips) nach Uhrzeit ----------
// Matrix: Zeitfenster -> Chips. "bis" = Minuten seit Öffnung (19:00).
// "ziel" = ID des Abschnitts in MenuView:
// bier, wein, softdrinks, gin, cocktails, longdrinks, whisky, spirituosen, obstbrand, snacks
// Direkt zu einer Untergruppe: Abschnitt + "-" + Untergruppe, z. B. longdrinks-spritz, wein-weisswein
const OEFFNUNG = 19 * 60
const CHIP_MATRIX = [
  { bis: 90, chips: [ // 19:00 – 20:30
    { label: 'Aperol', ziel: 'longdrinks-spritz' },
    { label: 'Weißwein', ziel: 'wein' },
    { label: 'Bier', ziel: 'bier' }
  ] },
  { bis: 210, chips: [ // 20:30 – 22:30
    { label: 'Gin & Tonic', ziel: 'gin' },
    { label: 'Cocktails', ziel: 'cocktails' },
    { label: 'Bier', ziel: 'bier' }
  ] },
  { bis: Infinity, chips: [ // ab 22:30 bis Schluss
    { label: 'Gin & Tonic', ziel: 'gin' },
    { label: 'Snacks', ziel: 'snacks' },
    { label: 'Schnaps', ziel: 'spirituosen' }
  ] }
]

// Minuten seit Öffnung (19:00) oder null, wenn geschlossen.
// Mo–Do bis 00:00, Fr & Sa bis 01:00, So geschlossen.
const minutenSeitOeffnung = (now) => {
  const day = now.getDay() // 0 = So, 6 = Sa
  const m = now.getHours() * 60 + now.getMinutes()
  if (m < 60 && (day === 6 || day === 0)) return m + 24 * 60 - OEFFNUNG // Nach Mitternacht (Fr/Sa-Betrieb)
  if (day === 0 || m < OEFFNUNG) return null
  return m - OEFFNUNG
}

const chips = ref([])

const updateChips = () => {
  const seit = minutenSeitOeffnung(new Date())
  chips.value = seit === null ? [] : CHIP_MATRIX.find((f) => seit < f.bis).chips
}

const checkOpenStatus = () => {
  const now = new Date()
  const day = now.getDay() // 0 = So, 1 = Mo, ... 6 = Sa
  const hours = now.getHours()
  const minutes = hours * 60 + now.getMinutes()

  const windowStart = 19 * 60 + 30 // 19:30 Uhr
  const windowEnd = 23 * 60        // 23:00 Uhr

  // 1. Badge-Logik (Mo–Sa zwischen 19:30 und 23:00 Uhr)
  if (day === 0) {
    isOpen.value = false
  } else {
    isOpen.value = (minutes >= windowStart && minutes < windowEnd)
  }

  // 2. Aktiven Tabellen-Row ermitteln (Berücksichtigt die Nachtschicht nach 00:00 Uhr)
  // Wenn es Sonntag zwischen 00:00 und 01:00 Uhr ist, gehört das noch zum Fr/Sa-Betrieb
  if ((day === 0 && hours < 1) || day === 5 || day === 6) {
    activeDay.value = 'fr-sa'
  } else if (day >= 1 && day <= 4) {
    activeDay.value = 'mo-do'
  } else {
    activeDay.value = 'so'
  }

  // 3. Vorschläge aktualisieren
  updateChips()
}

onMounted(() => {
  checkOpenStatus()
  setInterval(checkOpenStatus, 60000)
})
</script>

<style scoped>
.logo-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* mobil: echte sichtbare Höhe (Adressleiste) */
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 24px 24px 0;
  overflow-y: auto; /* sehr kleine Bildschirme: Seite scrollt statt zu überlappen */
}

.alert-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  padding: 12px 16px;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 1rem;
  letter-spacing: 0.5px;
  box-sizing: border-box;
  z-index: 10;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 280px;
  max-width: 85vw;
  height: auto;
  min-height: min(72vh, 560px);
  flex-shrink: 0;       /* nie unter die Inhaltshöhe schrumpfen */
  margin-top: clamp(0px, 5vh, 48px); /* feste Position von oben: nichts verschiebt sich beim Aufklappen */
}

.centered-logo {
  width: 100%;
  max-width: 260px;
  height: auto;
  object-fit: contain;
  display: block;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #111111;
  font-weight: 500;
  margin-top: -14px; /* Hier von -8px auf -14px erhöht, damit es näher ans Logo rückt */
  margin-bottom: 0px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
  animation: pulse-glow 2s infinite ease-in-out;
}

@keyframes pulse-glow {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}

/* Button */
.menu-link {
  font-family: sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #ffffff;
  background-color: #000000;
  text-decoration: none;
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-radius: 9999px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
  white-space: nowrap;
  box-sizing: border-box;
}

.menu-link:hover {
  opacity: 0.88;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.menu-link:active {
  transform: translateY(0);
}

.action-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Vorschläge: leise Textlinks */
.trending {
  margin-top: 22px;
  text-align: center;
}

.trending-title {
  margin: 0 0 2px 0;
  font-family: sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #000000;
  opacity: 0.45;
}

.trending-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.trend-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 8px;
  font-family: sans-serif;
  font-size: 1rem;
  color: #000000;
  text-decoration: underline;
  text-decoration-color: rgba(0, 0, 0, 0.3);
  text-underline-offset: 4px;
  -webkit-tap-highlight-color: transparent;
}

.trend-link:active {
  text-decoration-color: #000000;
}

.dot {
  font-family: sans-serif;
  color: #000000;
  opacity: 0.35;
}

/* Chat: kleiner Link statt Button */
.ask-link {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  font-family: sans-serif;
  font-size: 0.9rem;
  color: #000000;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.ask-muted {
  opacity: 0.5;
}

.ask-main {
  font-weight: 600;
}

.ask-link svg {
  transition: transform 0.2s ease;
}

.ask-link:active svg {
  transform: translateX(3px);
}

@media (hover: hover) {
  .ask-link:hover svg {
    transform: translateX(3px);
  }
}

/* Öffnungszeiten Tabelle */
.opening-hours {
  font-family: sans-serif;
  color: #000000;
  text-align: center;
  width: 100%;
}

.hours-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 8px;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.9rem;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.hours-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.5;
}

.chevron {
  opacity: 0.5;
  transition: transform 0.25s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

/* Auf-/Zuklappen: Tabelle direkt unter der Zeile "Heute ...", schiebt nur die Fußzeile */
.hours-panel {
  width: 280px;
  max-width: 85vw;
  flex-shrink: 0;
  font-family: sans-serif;
  color: #000000;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.hours-panel.open {
  grid-template-rows: 1fr;
}

.hours-panel-inner {
  min-height: 0;
  overflow: hidden;
  visibility: hidden;
  transition: visibility 0s linear 0.25s;
}

.hours-panel.open .hours-panel-inner {
  visibility: visible;
  transition-delay: 0s;
}

.hours-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  line-height: 1.6;
}

.hours-table td {
  padding: 4px 0;
}

.hours-table td:first-child {
  text-align: left;
}

.hours-table td:last-child {
  text-align: right;
}

/* Standard-Zustand: Dezent ausgegraut */
.hours-table tr {
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

/* Der aktive Tag hebt sich elegant und deutlich hervor */
.hours-table tr.active-row {
  opacity: 1;
  font-weight: 600;
}

/* Fußzeile */
.menu-footer {
  margin-top: auto;     /* Fußzeile unten; Platz dazwischen nutzt die Tabelle beim Aufklappen */
  padding-top: 16px;
  flex-shrink: 0;       /* liegt im normalen Fluss unter dem Inhalt, überlappt nie */
  width: 100%;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  text-align: center;
}

.legal-link {
  background: none;
  border: none;
  font-family: sans-serif;
  font-size: 0.8rem;
  color: #000000;
  opacity: 0.5;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legal-link:hover {
  opacity: 1;
}

/* Impressum Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 16px;
  box-sizing: border-box;
}

.modal-content {
  background-color: #ffffff;
  color: #000000;
  padding: 36px 28px 28px 28px;
  width: 100%;
  max-width: 380px;
  max-height: 85vh;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  font-family: sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: left;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 1.1rem;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.modal-content p {
  margin: 0 0 16px 0;
}

.modal-content p:last-child {
  margin-bottom: 0;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #000000;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.close-button:hover {
  opacity: 1;
}
/* Social & Kontakt Icons */
.social-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 8px;
  margin-bottom: 16px; /* Von 8px auf ca. 20px - 28px erhöhen */
}

.icon-link {
  color: #000000;
  opacity: 0.45;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
  text-decoration: none;
}

.icon-link:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.icon-link:active {
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .hours-panel,
  .hours-panel-inner,
  .chevron,
  .ask-link svg {
    transition: none;
  }
}
</style>