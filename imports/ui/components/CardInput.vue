<script setup lang="ts">
import { computed } from 'vue'

import { useCardKeyboard } from '@/composables/useCardKeyboard'
import { Card } from '@/types/PlayingCards.type.ts'
import { CARD_TEXT_WIDTH_REM } from '@/ui/components/PlayingCardText.vue'
import PlayingCardText from '@/ui/components/PlayingCardText.vue'

const props = defineProps<{ max: number }>()
const cards = defineModel<Card[]>({ default: [] })

const { show, hide } = useCardKeyboard()

const width = computed(() => {
  const cards = props.max * CARD_TEXT_WIDTH_REM
  const gaps = (props.max - 1) * 0.5
  const padding = 1.7
  return `${cards + gaps + padding}rem`
})

function openKeyboard() {
  show({
    onSelect: (selectedCard: Card) => {
      const nextCards =
        cards.value.length === props.max
          ? [selectedCard]
          : [...cards.value, selectedCard]
      cards.value = nextCards
      if (nextCards.length >= props.max) {
        hide()
      }
    },
    onDelete: () => {
      cards.value = cards.value.slice(0, -1)
    },
  })
}
</script>

<template>
  <button
    class="border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 hover:border-surface-400 dark:hover:border-surface-500 flex h-12 cursor-pointer items-center gap-2 rounded-md border px-3 transition-colors"
    :style="{ width }"
    @click="openKeyboard"
  >
    <span v-if="cards.length" class="flex flex-wrap gap-2">
      <PlayingCardText v-for="(card, i) in cards" :key="i" :card="card" />
    </span>
  </button>
</template>
