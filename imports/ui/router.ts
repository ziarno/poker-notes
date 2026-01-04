import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import GamesList from '/imports/ui/views/GamesList.vue'
import GameDetails from '/imports/ui/views/GameDetails.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'games-list',
    component: GamesList,
  },
  {
    path: '/games/:id',
    name: 'game-details',
    component: GameDetails,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
