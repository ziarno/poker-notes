<script setup lang="ts">
import { autorun, subscribe } from 'vue-meteor-tracker'

import { GamesCollection } from '@/api/collections'
import GameListItem from '@/ui/components/GameListItem.vue'

import { PLAYING_CARDS } from '../../constants/playingCrads.const.ts'

subscribe('games')
const games = autorun(() => GamesCollection.find({}).fetch()).result
</script>

<template>
  <h1>{{ $t('poker_notes') }}</h1>
  <p class="text-7xl text-black" v-for="card in PLAYING_CARDS">{{ card }}</p>
  <div>
    <GameListItem v-for="game of games" :key="game._id" :game="game" />
  </div>
</template>

<style scoped></style>
