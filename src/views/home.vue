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

      <!-- Aktionen: Karte ansehen / Chat -->
      <div class="action-group">
        <a 
          href="https://menu.tillersystems.com/48925/zentrale/menu/60568" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="menu-link"
        >
          Karte ansehen
        </a>

        <div class="or-divider" role="separator" aria-label="oder">
          <span>oder</span>
        </div>

        <a 
          href="https://zentrale-kleve.de/chat" 
          class="menu-link menu-link--outline"
        >
          Chat starten
        </a>
      </div>

      <!-- Öffnungszeiten -->
      <div class="opening-hours">
              <h3 class="hours-title">Öffnungszeiten</h3>
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
      <!-- Social & Kontakt Icons -->


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
import { ref, onMounted } from 'vue'

const alertMessage = ref('')
const showImpressum = ref(false)
const isOpen = ref(false)
const activeDay = ref('mo-do')

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
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 24px;
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
  height: 72vh;
  max-height: 560px;
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
  font-weight: 350;
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

/* Zweite Variante: Outline (weiß mit schwarzem Rand) */
.menu-link--outline {
  color: #000000;
  background-color: #ffffff;
  border: 1.5px solid #000000;
  box-shadow: none;
}

.menu-link--outline:hover {
  background-color: #000000;
  color: #ffffff;
  opacity: 1;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.menu-link:hover {
  opacity: 0.88;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.menu-link:active {
  transform: translateY(0);
}

/* Button-Gruppe mit "oder"-Trenner */
.action-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.or-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 12px 0;
  font-family: sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #000000;
}

.or-divider span {
  opacity: 0.5;
}

.or-divider::before,
.or-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #000000;
  opacity: 0.15;
}

/* Öffnungszeiten Tabelle */
.opening-hours {
  font-family: sans-serif;
  color: #000000;
  text-align: center;
  width: 100%;
}

.hours-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  font-weight: 600;
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
  position: absolute;
  bottom: 24px;
  left: 0;
  width: 100%;
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
/* Dezenter Lichtreflex auf dem Chat-Button */
.menu-link--outline {
  position: relative;
  overflow: hidden;
}

.menu-link--outline::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(100deg, transparent, rgba(0, 0, 0, 0.08), transparent);
  transform: translateX(-150%) skewX(-20deg);
  animation: button-shine 7s ease-in-out infinite;
  pointer-events: none;
}

@keyframes button-shine {
  0%, 70% { transform: translateX(-150%) skewX(-20deg); }
  100%    { transform: translateX(350%) skewX(-20deg); }
}

/* Bewegung abschalten, wenn das Gerät "weniger Bewegung" eingestellt hat */
@media (prefers-reduced-motion: reduce) {
  .menu-link--outline::after {
    animation: none;
    display: none;
  }
}
</style>