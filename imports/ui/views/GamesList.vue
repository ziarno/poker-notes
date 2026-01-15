<script setup lang="ts">
import Button from '@volt/Button.vue'
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
  <GameListItem v-for="game of games" :key="game._id" :game="game" />
  <div class="absolute bottom-0 left-0 right-0 flex justify-center mb-10">
    <Button
      raised
      class="text-white"
      @click="$router.push('/new')"
      icon="pi pi-plus"
      :label="$t('new_game')"
    />
  </div>
</template>

<style scoped></style>
