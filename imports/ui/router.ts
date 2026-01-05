import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import CreateNewGame from '@/ui/views/CreateNewGame.vue'
import GameDetails from '@/ui/views/GameDetails.vue'
import GamesList from '@/ui/views/GamesList.vue'

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
