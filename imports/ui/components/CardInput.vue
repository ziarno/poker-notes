<script setup lang="ts">
import { ref } from 'vue'

import { useCardKeyboard } from '@/composables/useCardKeyboard'
import { Card } from '@/types/PlayingCards.type.ts'
import PlayingCard from '@/ui/components/PlayingCard.vue'

const card = ref<Card | null>(null)

const { show } = useCardKeyboard()

function openKeyboard() {
  show((selectedCard: Card) => {
    console.log(selectedCard)
    card.value = selectedCard
  })
}
</script>

<template>
  <button
    class="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 border-surface-300 dark:border-surface-600 flex h-20 w-14 items-center justify-center rounded-lg border-2 border-dashed transition-colors"
    @click="openKeyboard"
  >
    <PlayingCard v-if="card" :card="card" />
    <i v-else class="pi pi-plus text-surface-400 text-xl"></i>
  </button>
</template>
