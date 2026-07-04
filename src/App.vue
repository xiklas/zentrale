<template>
  <div class="logo-container">
    <!-- Hier binden wir das Logo direkt aus deinem Assets-Ordner ein -->
    <img src="/src/assets/zentrale_logo.png" alt="Zentrale Logo" class="logo" />
  </div>
</template>

<style scoped>
/* Dieser Block sorgt dafür, dass das Logo perfekt in der Mitte des Bildschirms sitzt */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Nutzt die volle Höhe des Bildschirms */
  background-color: #1a1a1a; /* Ein schicker, dunkler Hintergrund – kannst du beliebig ändern */
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

.logo {
  max-width: 90%; /* Verhindert, dass das Logo auf dem Handy den Bildschirm sprengt */
  width: 400px;    /* Maximale Breite auf großen Bildschirmen */
  height: auto;    /* Hält die Proportionen des Bildes sauber */
}
</style>