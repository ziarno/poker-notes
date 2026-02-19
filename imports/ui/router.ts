import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import GameDetailsView from '@/ui/views/GameDetails'
import GamesListView from '@/ui/views/GamesList'
import NewGameView from '@/ui/views/NewGame'
import OddsView from '@/ui/views/Odds'

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
  {
    path: '/odds',
    component: OddsView,
    meta: { depthForAnimation: 5 },
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
