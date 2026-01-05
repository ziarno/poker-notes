import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import GamesList from '/imports/ui/views/GamesList.vue'
import GameDetails from '/imports/ui/views/GameDetails.vue'
import CreateNewGame from '/imports/ui/views/CreateNewGame.vue'

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
