import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import GameDetailsView from '@/ui/views/GameDetails.view.vue'
import GamesListView from '@/ui/views/GamesList.view.vue'
import NewGameView from '@/ui/views/NewGame.view.vue'

declare module 'vue-router' {
  interface RouteMeta {
    depthForAnimation: number
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: GamesListView,
    meta: { depthForAnimation: 0 },
  },
  {
    path: '/games/:id',
    component: GameDetailsView,
    meta: { depthForAnimation: 2 },
  },
  {
    path: '/new',
    component: NewGameView,
    meta: { depthForAnimation: 1 },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ top: 0 })
      }, 160)
    })
  },
})
