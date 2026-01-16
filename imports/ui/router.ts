import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import GameDetailsView from '@/ui/views/GameDetails.view..vue'
import GamesListView from '@/ui/views/GamesList.view.vue'
import ViewNewGameView from '@/ui/views/ViewNewGame.view.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: GamesListView,
  },
  {
    path: '/games/:id',
    component: GameDetailsView,
  },
  {
    path: '/new',
    component: ViewNewGameView,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
