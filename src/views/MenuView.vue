<template>
  <div class="menu-page">
    <div class="menu-container">

      <!-- Header: Zurück-Pfeil | Titel | Platzhalter für Symmetrie -->
      <header class="menu-header">
        <a href="/" class="back-link" aria-label="Zurück zur Startseite">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </a>
        <h1 class="menu-title">Karte</h1>
        <span class="header-spacer" aria-hidden="true"></span>
      </header>

      <!-- Kategorien -->
      <main class="menu-content">
        <section v-for="a in abschnitte" :key="a.id" class="abschnitt">
          <h2 class="abschnitt-kopf">
            <button
              type="button"
              class="kopf-button"
              :aria-expanded="istOffen(a.id)"
              :aria-controls="'panel-' + a.id"
              @click="toggle(a.id)"
            >
              <span class="kopf-titel">{{ a.titel }}</span>
              <span class="kopf-anzahl">{{ a.anzahl }}</span>
              <svg class="chevron" :class="{ gedreht: istOffen(a.id) }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </h2>

          <div :id="'panel-' + a.id" class="panel" :class="{ offen: istOffen(a.id) }" role="region">
            <div class="panel-inner">
              <p v-if="a.hinweis" class="hinweis">{{ a.hinweis }}</p>

              <div v-for="u in a.untergruppen" :key="u.name" class="untergruppe">
                <h3 v-if="a.zeigeUntergruppen" class="untergruppe-titel">{{ u.name }}</h3>
                <ul class="liste">
                  <li v-for="z in u.zeilen" :key="z.name" class="zeile">
                    <span class="zeile-name">{{ z.name }}</span>
                    <span class="zeile-preise">
                      <span v-for="(v, i) in z.varianten" :key="i" class="preis-zeile">
                        <span v-if="v.menge" class="menge">{{ v.menge }}</span>
                        <span class="preis">{{ euro(v.preis) }}</span>
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Pfad ggf. an dein Projekt anpassen (Datei liegt z. B. in src/assets/)
import karte from '../assets/karte_kategorisiert.json'

// ---------- Aufbau der Karte ----------
// Welche "kategorie"-Werte der JSON in welchem aufklappbaren Abschnitt landen.
// Reihenfolge hier = Reihenfolge auf der Seite. Neue, unbekannte Kategorien
// landen automatisch unter "Weiteres", es geht also nichts verloren.
const ABSCHNITTE = [
  { id: 'bier', titel: 'Bier', untergruppen: true,
    kategorien: ['Bier', 'Biermischgetränk', 'Alkoholfreies Bier'] },
  { id: 'wein', titel: 'Wein & Sekt', untergruppen: true,
    kategorien: ['Weißwein', 'Rotwein', 'Roséwein', 'Schaumwein', 'Weinschorle'] },
  { id: 'softdrinks', titel: 'Softdrinks & Säfte', untergruppen: true,
    kategorien: ['Wasser', 'Cola & Limonade', 'Saft', 'Saftschorle', 'Eistee', 'Mixer'] },
  { id: 'gin', titel: 'Gin & Tonic', untergruppen: true,
    hinweis: 'Alle Gins mit 4 cl und Tonic.',
    kategorien: ['Gin & Tonic', 'Gin & Tonic (alkoholfrei)'] },
  { id: 'cocktails', titel: 'Cocktails', untergruppen: false,
    kategorien: ['Cocktail'] },
  { id: 'longdrinks', titel: 'Longdrinks & Spritz', untergruppen: true,
    kategorien: ['Longdrink', 'Spritz'] },
  { id: 'whisky', titel: 'Whisky', untergruppen: true,
    kategorien: ['Irish Whiskey', 'American Whiskey', 'Single Malt Whisky'] },
  { id: 'spirituosen', titel: 'Spirituosen & Liköre', untergruppen: false,
    kategorien: ['Rum', 'Wodka', 'Tequila & Mezcal', 'Genever', 'Weinbrand & Brandy', 'Korn',
      'Akvavit', 'Anisspirituose', 'Kräuterlikör & Bitter', 'Pfefferminzlikör', 'Likör',
      'Wermut', 'Shot', 'Sonstige Spirituosen'] },
  { id: 'obstbrand', titel: 'Obstbrände & Grappa', untergruppen: false,
    kategorien: ['Grappa', 'Obstbrand', 'Geist'] },
  { id: 'snacks', titel: 'Snacks', untergruppen: false,
    kategorien: ['Snack'] },
  { id: 'sonstiges', titel: 'Sonstiges', untergruppen: false,
    kategorien: ['Sonstiges'] }
]

// Anzeigenamen für Untergruppen, wenn der Kategoriename so nicht passt
const LABELS = {
  'Gin & Tonic': 'Mit Alkohol',
  'Gin & Tonic (alkoholfrei)': 'Alkoholfrei',
  'Biermischgetränk': 'Radler'
}

// Bier steht in der JSON in zwei Gruppen (Fass / Flasche), hier getrennt anzeigen
const untergruppeName = (e) => {
  if (e.kategorie === 'Bier') {
    return e.gruppe === 'bier_vom_fass' ? 'Vom Fass' : 'Aus der Flasche'
  }
  return LABELS[e.kategorie] ?? e.kategorie
}

const baueAbschnitte = (daten) => {
  const alle = Object.entries(daten).flatMap(([gruppe, items]) =>
    items.map((i) => ({ ...i, gruppe }))
  )

  // Unbekannte Kategorien einsammeln
  const bekannt = new Set(ABSCHNITTE.flatMap((a) => a.kategorien))
  const uebrige = [...new Set(alle.filter((e) => !bekannt.has(e.kategorie)).map((e) => e.kategorie))]
  const defs = uebrige.length
    ? [...ABSCHNITTE, { id: 'weiteres', titel: 'Weiteres', untergruppen: false, kategorien: uebrige }]
    : ABSCHNITTE

  return defs
    .map((def) => {
      // Einträge in der Reihenfolge der Kategorien, dann der Datei
      const items = def.kategorien.flatMap((k) => alle.filter((e) => e.kategorie === k))

      // In Untergruppen aufteilen
      const gruppen = new Map()
      for (const e of items) {
        const name = untergruppeName(e)
        if (!gruppen.has(name)) gruppen.set(name, [])
        gruppen.get(name).push(e)
      }

      // Gleiche Namen zusammenfassen (z. B. Pilsner 0,5 l und 0,3 l = eine Zeile)
      const untergruppen = [...gruppen].map(([name, liste]) => {
        const zeilen = []
        const nachName = new Map()
        for (const e of liste) {
          if (!nachName.has(e.name)) {
            const z = { name: e.name, varianten: [] }
            nachName.set(e.name, z)
            zeilen.push(z)
          }
          nachName.get(e.name).varianten.push({ menge: e.menge ?? null, preis: e.preis_eur })
        }
        return { name, zeilen }
      })

      return {
        id: def.id,
        titel: def.titel,
        hinweis: def.hinweis ?? null,
        zeigeUntergruppen: def.untergruppen && untergruppen.length > 1,
        anzahl: untergruppen.reduce((summe, u) => summe + u.zeilen.length, 0),
        untergruppen
      }
    })
    .filter((a) => a.anzahl > 0)
}

const abschnitte = computed(() => baueAbschnitte(karte))

// ---------- Auf- und Zuklappen (mehrere dürfen offen sein) ----------
const offen = ref({})
const istOffen = (id) => !!offen.value[id]
const toggle = (id) => {
  offen.value = { ...offen.value, [id]: !offen.value[id] }
}

const euroFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
const euro = (preis) => euroFormat.format(preis)
</script>
<style scoped>
/* ---------- Seite & Container ---------- */
.menu-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: #ffffff !important;
  color: #000000 !important;
  color-scheme: light !important;
  font-family: sans-serif;
  text-align: left;
  display: flex;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.menu-container {
  width: 100%;
  max-width: 640px;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: #ffffff !important;
  color: #000000 !important;
}

/* ---------- Header ---------- */
.menu-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  padding: 4px 8px;
  padding-top: calc(4px + env(safe-area-inset-top, 0px));
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  background-color: #ffffff !important;
}

.back-link {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000 !important;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.back-link svg {
  stroke: #000000 !important;
}

.back-link:active {
  opacity: 1;
}

.menu-title {
  margin: 0;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #000000 !important;
}

/* ---------- Inhalt ---------- */
.menu-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 0 16px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  background-color: #ffffff !important;
}

.abschnitt {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.abschnitt-kopf {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}

.kopf-button {
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  background: transparent !important;
  border: none;
  color: #000000 !important;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.kopf-titel {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #000000 !important;
}

.kopf-anzahl {
  font-size: 0.8rem;
  color: #000000 !important;
  opacity: 0.4;
}

.chevron {
  flex-shrink: 0;
  color: #000000 !important;
  stroke: #000000 !important;
  opacity: 0.6;
  transition: transform 0.25s ease;
}

.chevron.gedreht {
  transform: rotate(180deg);
}

/* ---------- Auf-/Zuklappen ---------- */
.panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.panel.offen {
  grid-template-rows: 1fr;
}

.panel-inner {
  min-height: 0;
  overflow: hidden;
  visibility: hidden;
  transition: visibility 0s linear 0.25s;
}

.panel.offen .panel-inner {
  visibility: visible;
  transition-delay: 0s;
}

/* ---------- Listen ---------- */
.hinweis {
  margin: 0 0 4px 0;
  font-size: 0.85rem;
  color: #000000 !important;
  opacity: 0.55;
}

.untergruppe {
  margin-bottom: 8px;
}

.untergruppe-titel {
  margin: 14px 0 2px 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #000000 !important;
  opacity: 0.5;
}

.liste {
  list-style: none;
  margin: 0;
  padding: 0 0 4px 0;
}

.zeile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 10px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
  font-size: 1rem;
  line-height: 1.35;
  color: #000000 !important;
}

.zeile:first-child {
  border-top: none !important;
}

.zeile-name {
  flex: 1;
  min-width: 0;
  overflow-wrap: break-word;
  color: #000000 !important;
}

.zeile-preise {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.preis-zeile {
  display: flex;
  align-items: baseline;
  gap: 10px;
  white-space: nowrap;
}

.menge {
  font-size: 0.85rem;
  color: #000000 !important;
  opacity: 0.5;
}

.preis {
  font-variant-numeric: tabular-nums;
  color: #000000 !important;
}

@media (prefers-reduced-motion: reduce) {
  .panel,
  .chevron,
  .panel-inner {
    transition: none;
  }
}
</style>