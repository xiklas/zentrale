<template>
  <div class="menu-container">
    <!-- Header with Logo spanning the entire width -->
    <header class="menu-header">
      <img src="/src/assets/zentrale_logo.png" alt="Zentrale Logo" class="logo" />
    </header>

    <!-- Menu Content -->
    <main class="menu-content">
      
      <!-- Loop through categories -->
      <div 
        v-for="(category, index) in menuCategories" 
        :key="index" 
        class="category-section"
      >
        <!-- Category Header (Togglable) -->
        <button 
          class="category-toggle-btn" 
          @click="toggleCategory(index)"
          :aria-expanded="activeCategory === index"
        >
          <h2 class="category-title">{{ category.name }}</h2>
          <!-- The plus sign that shifts into an X -->
          <span class="toggle-icon" :class="{ 'is-active': activeCategory === index }"></span>
        </button>

        <!-- Expandable Drinks List -->
        <div class="menu-list" :class="{ 'is-open': activeCategory === index }">
          <div 
            v-for="(item, itemIndex) in category.items" 
            :key="itemIndex" 
            class="menu-item"
          >
            <div class="item-details">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-size">{{ item.size }}</span>
            </div>
            <span class="item-price">{{ item.price }}</span>
          </div>
        </div>
        
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// -1 means all closed initially so the long list stays compact on mobile
const activeCategory = ref(-1) 

const toggleCategory = (index) => {
  if (activeCategory.value === index) {
    activeCategory.value = -1 
  } else {
    activeCategory.value = index 
  }
}

// Adjusted categories with specific dummy data
const menuCategories = ref([
  {
    name: 'Fassbier',
    items: [
      { name: 'Pils vom Fass', size: '0.3l', price: '3,80 €' },
      { name: 'Pils vom Fass', size: '0.5l', price: '4,90 €' },
      { name: 'Radler', size: '0.3l', price: '3,60 €' }
    ]
  },
  {
    name: 'Flaschenbier',
    items: [
      { name: 'Weizenbier Naturtrüb', size: '0.5l', price: '4,50 €' },
      { name: 'Helles Flasche', size: '0.33l', price: '3,70 €' },
      { name: 'Alkoholfreies Pils', size: '0.33l', price: '3,50 €' }
    ]
  },
  {
    name: 'Rotwein',
    items: [
      { name: 'Primitivo IGT', size: '0.2l', price: '5,50 €' },
      { name: 'Merlot', size: '0.2l', price: '5,20 €' }
    ]
  },
  {
    name: 'Weißwein',
    items: [
      { name: 'Grauburgunder', size: '0.2l', price: '5,20 €' },
      { name: 'Chardonnay', size: '0.2l', price: '5,40 €' },
      { name: 'Weinschorle', size: '0.25l', price: '4,20 €' }
    ]
  },
  {
    name: 'Aperitiv',
    items: [
      { name: 'Aperol Spritz', size: '0.25l', price: '6,50 €' },
      { name: 'Hugo', size: '0.25l', price: '6,50 €' },
      { name: 'Lillet Wild Berry', size: '0.25l', price: '6,80 €' }
    ]
  },
  {
    name: 'Gin Tonic',
    items: [
      { name: 'Standard Gin Tonic (Gordon\'s)', size: '4cl', price: '7,50 €' },
      { name: 'Premium Gin Tonic (Hendrick\'s)', size: '4cl', price: '9,50 €' }
    ]
  },
  {
    name: 'Longdrinks',
    items: [
      { name: 'Cuba Libre', size: '4cl', price: '7,80 €' },
      { name: 'Vodka Lemon / Energy', size: '4cl', price: '8,00 €' },
      { name: 'Whisky Cola', size: '4cl', price: '7,80 €' }
    ]
  },
  {
    name: 'Softdrinks',
    items: [
      { name: 'Coca-Cola', size: '0.33l', price: '3,40 €' },
      { name: 'Coca-Cola Zero', size: '0.33l', price: '3,40 €' },
      { name: 'Fanta / Spree / Mezzo Mix', size: '0.33l', price: '3,40 €' }
    ]
  },
  {
    name: 'Säfte/Schorlen',
    items: [
      { name: 'Apfelsaftschorle', size: '0.33l', price: '3,50 €' },
      { name: 'Rhabarbersaftschorle', size: '0.33l', price: '3,60 €' },
      { name: 'Orangensaft', size: '0.2l', price: '3,10 €' }
    ]
  },
  {
    name: 'Wasser',
    items: [
      { name: 'Tafelwasser Sprudel', size: '0.25l', price: '2,90 €' },
      { name: 'Tafelwasser Still', size: '0.25l', price: '2,90 €' },
      { name: 'Wasser Flasche (Groß)', size: '0.75l', price: '6,20 €' }
    ]
  },
  {
    name: 'Cocktails',
    items: [
      { name: 'Caipirinha', size: 'Glas', price: '8,50 €' },
      { name: 'Mojito', size: 'Glas', price: '8,50 €' },
      { name: 'Sex on the Beach', size: 'Glas', price: '8,90 €' }
    ]
  },
  {
    name: 'Shots',
    items: [
      { name: 'Berliner Luft', size: '2cl', price: '2,50 €' },
      { name: 'Jägermeister', size: '2cl', price: '2,80 €' },
      { name: 'Tequila (Silver/Gold)', size: '2cl', price: '3,00 €' }
    ]
  }
])
</script>

<style scoped>
/* Mobile-first base styles */
.menu-container {
  min-height: 100vh;
  background-color: #DD6435;
  color: #ffffff; 
  font-family: sans-serif;
  padding: 24px 16px;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* Header / Full Width Logo */
.menu-header {
  display: flex;
  justify-content: center;
  margin-left: -16px;
  margin-right: -16px;
  margin-top: -24px; 
  margin-bottom: 32px;
}

.logo {
  width: 100%; 
  height: auto;
  display: block; 
}

/* Category Section Layout */
.category-section {
  margin-bottom: 12px;
}

.category-toggle-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 0;
  color: #ffffff; 
  text-align: left;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent; 
}

.category-title {
  font-size: 1.4rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffffff; 
}

/* Cool Shift Plus-to-X Icon */
.toggle-icon {
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0; /* Ensures the icon doesn't shrink if names get long */
  margin-left: 10px;
}

.toggle-icon::before,
.toggle-icon::after {
  content: '';
  position: absolute;
  background-color: #ffffff;
  transition: transform 0.3s ease-in-out;
}

.toggle-icon::before {
  top: 8px;
  left: 0;
  width: 18px;
  height: 2px;
}

.toggle-icon::after {
  top: 0;
  left: 8px;
  width: 2px;
  height: 18px;
}

.toggle-icon.is-active::before {
  transform: rotate(135deg);
}
.toggle-icon.is-active::after {
  transform: rotate(135deg);
}

/* Expandable Menu List Transition */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 16px; 
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease-in-out, padding 0.3s ease;
  padding: 0 4px;
}

.menu-list.is-open {
  max-height: 600px; /* Increased slightly to handle categories with more items */
  padding: 16px 4px 24px 4px;
}

/* Menu Item Typography */
.menu-item {
  display: flex;
  justify-content: space-between; 
  align-items: baseline;
  font-size: 1.1rem;
}

.item-details {
  display: flex;
  flex-direction: column; 
}

.item-name {
  font-weight: bold;
}

.item-size {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 2px;
}

.item-price {
  font-weight: bold;
  font-size: 1.2rem;
}
</style>