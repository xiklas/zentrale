<template>
  <div class="logo-container">
    
    <!-- Info-Banner -->
    <div v-if="alertMessage" class="alert-banner">
      {{ alertMessage }}
    </div>

    <!-- Der Wrapper passt sich automatisch der Breite des Logos an -->
    <div class="content-wrapper">
      <!-- Logo -->
      <img src="/src/assets/logo.png" alt="Zentrale Logo" class="centered-logo" />
      
      <!-- Link zur Getränkekarte -->
      <a 
        href="https://menu.tillersystems.com/48925/zentrale/menu/60258" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="menu-link"
      >
        Getränkekarte
      </a>

      <!-- Öffnungszeiten -->
      <div class="opening-hours">
        <h3 class="hours-title">Öffnungszeiten</h3>
        <table class="hours-table">
          <tr>
            <td>Di – Do</td>
            <td>19:00 – 00:00</td>
          </tr>
          <tr>
            <td>Fr & Sa</td>
            <td>19:00 – 01:00</td>
          </tr>
          <tr>
            <td>So & Mo</td>
            <td>Geschlossen</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Fußzeile mit Impressum-Link -->
    <footer class="menu-footer">
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
        
        <br />
        <p><strong>Kontakt:</strong></p>
        <p>Telefon: 02821-9780881</p>
        <p>E-Mail: [E-MAIL-ADRESSE]</p>
        
        <br />
        <p><strong>Zuständige Aufsichtsbehörde:</strong></p>
        <p>Ordnungsamt Kleve</p>
        <p>Landwehr 4–6, 47533 Kleve</p>
        
        <br />
        <p><strong>Umsatzsteuer-ID:</strong></p>
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
        <p>DE334586674</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const alertMessage = ref('')
const showImpressum = ref(false)
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
  display: grid;
  grid-template-columns: 100%;
  justify-items: center;
  gap: 28px;
  width: max-content; 
  max-width: 100%;
}

.centered-logo {
  max-width: 100%;
  max-height: 40vh;
  object-fit: contain;
  display: block;
}

.menu-link {
  font-family: sans-serif;
  font-size: 1.1rem;
  font-weight: 300;
  color: #ffffff;
  background-color: #000000;
  text-decoration: none;
  padding: 14px 0;
  width: 100%; 
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  box-sizing: border-box;
}

.menu-link:hover {
  opacity: 0.8;
}

.opening-hours {
  font-family: sans-serif;
  color: #000000;
  text-align: center;
  margin-top: 8px;
  width: 100%; 
}

.hours-title {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  font-weight: 400;
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
  font-weight: 500;
}

.hours-table td:last-child {
  text-align: right;
  opacity: 0.8;
}

/* Fußzeile ganz unten */
.menu-footer {
  position: absolute;
  bottom: 16px;
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

/* Impressum Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: #ffffff;
  color: #000000;
  padding: 32px;
  width: 90%;
  max-width: 400px;
  box-sizing: border-box;
  position: relative;
  font-family: sans-serif;
  font-size: 0.95rem;
  line-height: 1.4;
  text-align: left;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-content p {
  margin: 4px 0;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}
</style>