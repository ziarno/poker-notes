import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import GamesList from '@/ui/views/GamesList.vue'
import GameDetails from '@/ui/views/GameDetails.vue'
import CreateNewGame from '@/ui/views/CreateNewGame.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: GamesList,
  },
  {
    path: '/games/:id',
    component: GameDetails,
  },
  {
    path: '/new',
    component: CreateNewGame,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
