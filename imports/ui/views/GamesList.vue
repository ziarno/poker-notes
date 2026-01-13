<script setup lang="ts">
import { autorun, subscribe } from 'vue-meteor-tracker'

import { GamesCollection } from '@/api/collections'
import GameListItem from '@/ui/components/GameListItem.vue'

subscribe('games')
const games = autorun(() => GamesCollection.find({}).fetch()).result
</script>

<template>
  <h1
    class="text-center text-5xl font-[Poker] mb-3 mt-3 text-black dark:text-white"
  >
    {{ $t('poker_notes') }}
  </h1>
  <div>
    <GameListItem v-for="game of games" :key="game._id" :game="game" />
  </div>
</template>

<style scoped></style>
