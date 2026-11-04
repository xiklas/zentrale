<template>
  <div class="getraenkekarte-page">
    <header class="header">
      <div class="header-content">
        <h1>Zentrale Kleve</h1>
        <p class="subtitle">Getränke & Snacks</p>
      </div>

      <div class="search-container">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Getränk oder Kategorie suchen..."
          class="search-input"
        />
      </div>

      <nav class="category-nav">
        <button 
          class="cat-btn" 
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          Alle
        </button>
        <button 
          v-for="(catName, key) in categoryLabels" 
          :key="key"
          class="cat-btn"
          :class="{ active: activeCategory === key }"
          @click="activeCategory = key"
        >
          {{ catName }}
        </button>
      </nav>
    </header>

    <main class="menu-container">
      <div v-if="filteredCategories.length === 0" class="no-results">
        Keine Getränke für "{{ searchQuery }}" gefunden.
      </div>

      <section 
        v-for="cat in filteredCategories" 
        :key="cat.key" 
        class="category-section"
      >
        <h2 class="category-title">{{ cat.title }}</h2>
        <div class="items-list">
          <div 
            v-for="(item, index) in cat.items" 
            :key="index" 
            class="menu-item"
          >
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span v-if="item.menge || item.details" class="item-meta">
                {{ item.menge || item.details }}
              </span>
            </div>
            <div class="item-dots"></div>
            <div class="item-price">
              {{ formatPrice(item.preis_eur) }}
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>Alle Preise inkl. gesetzlicher MwSt. • Zentrale Kleve</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Importiert die JSON-Datei direkt aus dem Projekt
import menuDataJson from '../assets/karte.json'

const categoryLabels = {
  bier_vom_fass: 'Bier vom Fass',
  flaschenbiere: 'Flaschenbiere',
  wein: 'Weine & Champagner',
  softdrinks_und_saefte: 'Softdrinks & Säfte',
  cocktails: 'Cocktails',
  longdrinks: 'Longdrinks',
  gin_and_tonic: 'Gin & Tonic',
  whisky: 'Whisky',
  spirituosen: 'Spirituosen',
  obstler_grappa: 'Obstler & Grappa',
  snacks: 'Snacks',
  der_klever: 'Der Klever'
}

// Die Daten kommen nun direkt aus der JSON-Datei
const menuData = ref(menuDataJson)

const searchQuery = ref('')
const activeCategory = ref('all')

function formatPrice(val) {
  if (typeof val !== 'number') return ''
  return val.toFixed(2).replace('.', ',') + ' €'
}

const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const result = []

  Object.keys(menuData.value).forEach(key => {
    if (activeCategory.value !== 'all' && activeCategory.value !== key) {
      return
    }

    const title = categoryLabels[key] || key
    const items = menuData.value[key] || []

    const matchingItems = items.filter(item => {
      const matchName = item.name.toLowerCase().includes(query)
      const matchDetails = item.details ? item.details.toLowerCase().includes(query) : false
      const matchCategory = title.toLowerCase().includes(query)
      return matchName || matchDetails || matchCategory
    })

    if (matchingItems.length > 0) {
      result.push({
        key,
        title,
        items: matchingItems
      })
    }
  })

  return result
})
</script>

<style scoped>
.getraenkekarte-page {
  background-color: #0d0d0d;
  color: #ffffff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.header {
  position: sticky;
  top: 0;
  background-color: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #262626;
  z-index: 100;
  padding: 1.5rem 1rem 1rem;
}

.header-content {
  text-align: center;
  margin-bottom: 1.25rem;
}

.header-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0;
}

.subtitle {
  color: #888888;
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 1rem;
}

.search-input {
  width: 100%;
  background-color: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #ffffff;
}

.category-nav {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  max-width: 800px;
  margin: 0 auto;
  scrollbar-width: none;
}

.category-nav::-webkit-scrollbar {
  display: none;
}

.cat-btn {
  background: transparent;
  border: 1px solid #333333;
  color: #888888;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-btn.active, .cat-btn:hover {
  background-color: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

.menu-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.category-section {
  margin-bottom: 2.5rem;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-bottom: 1px solid #262626;
  padding-bottom: 0.5rem;
  margin-bottom: 1.25rem;
  color: #e5e5e5;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.menu-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.item-info {
  display: flex;
  flex-direction: column;
  max-width: 65%;
}

.item-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #ffffff;
}

.item-meta {
  font-size: 0.75rem;
  color: #737373;
  margin-top: 0.15rem;
}

.item-dots {
  flex-grow: 1;
  border-bottom: 1px dotted #333333;
  margin: 0 0.75rem;
}

.item-price {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

.no-results {
  text-align: center;
  color: #737373;
  padding: 3rem 0;
}

.footer {
  text-align: center;
  padding: 2rem 1rem;
  border-top: 1px solid #1a1a1a;
  color: #525252;
  font-size: 0.75rem;
}
</style>