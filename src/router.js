import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/home.vue'
import Menu from './views/menu.vue'
import TestView from './views/TestView.vue'
import ChatView from './views/ChatView.vue'
import MenuView from './views/MenuView.vue'

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
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView

  },
  {
    path: '/menu2',
    name: 'Menu2',
    component: MenuView

  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router