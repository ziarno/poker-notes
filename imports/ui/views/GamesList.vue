<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { autorun, subscribe } from 'vue-meteor-tracker'

import { GamesCollection } from '@/api/collections'
import GameListItem from '@/ui/components/GameListItem.vue'

const { t } = useI18n()

subscribe('games')
const games = autorun(() => GamesCollection.find({}).fetch()).result
const gamesSorted = computed(() =>
  games.value?.sort((g1, g2) => g2.date.getTime() - g1.date.getTime())
)
</script>

<template>
  <h1
    class="text-center text-5xl font-[Poker] mb-3 mt-3 text-black dark:text-white"
  >
    {{ t('poker_notes') }}
  </h1>
  <div class="flex justify-center mt-8 mb-10">
    <SecondaryButton
      raised
      @click="$router.push('/new')"
      icon="pi pi-plus"
      :label="t('new_game')"
    />
  </div>
  <GameListItem v-for="game of gamesSorted" :key="game._id" :game="game" />
  <div class="fixed bottom-0 left-0 right-0 flex justify-center mb-10"></div>
</template>

<style scoped></style>
