import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import UsersView from '@/views/UsersView.vue'
import CollaborativeWorkView from '@/views/CollaborativeWorkView.vue'

/**
 * Router simplificado para MVP
 * Solo incluye:
 * - Home: Vista única para generar planeaciones
 * - CollaborativeWork: Generador de trabajos colaborativos
 * - Users: Gestión de usuarios (opcional)
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        // Ruta principal - Generador de planeaciones
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
        // Trabajo Colaborativo
        {
          path: 'collaborative-work',
          name: 'CollaborativeWork',
          component: CollaborativeWorkView,
        },
        // Usuarios (opcional)
        {
          path: 'users',
          name: 'Users',
          component: UsersView,
        },
      ],
    },
  ],
})

export default router
