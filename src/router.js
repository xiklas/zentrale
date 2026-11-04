import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/home.vue'
import Menu from './views/menu.vue'
import TestView from './views/TestView.vue' // 1. Importieren

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/new',
    name: 'Menu',
    component: Menu
  },
  // 2. Neue Test-Route anlegen:
  {
    path: '/test',
    name: 'Test',
    component: TestView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router