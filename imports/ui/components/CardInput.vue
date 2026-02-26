<script setup lang="ts">
import { computed } from 'vue'

import { useCardKeyboard } from '@/composables/useCardKeyboard'
import { Card } from '@/types/PlayingCards.type.ts'
import { CARD_TEXT_WIDTH_REM } from '@/ui/components/PlayingCardText.vue'
import PlayingCardText from '@/ui/components/PlayingCardText.vue'

const props = defineProps<{ max: number; label?: string }>()
const cards = defineModel<Card[]>({ default: [] })

const { show, isActive } = useCardKeyboard(cards, props.max, props.label)

const width = computed(() => {
  const cardsWidth = props.max * CARD_TEXT_WIDTH_REM
  const gaps = (props.max - 1) * 0.5
  const padding = 1.8
  return `${cardsWidth + gaps + padding}rem`
})
</script>

<template>
  <button
    class="border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 flex h-12 cursor-pointer items-center gap-2 rounded-md border px-3 transition-colors"
    :class="
      isActive
        ? 'ring-primary-500 dark:ring-primary-400 ring-2'
        : 'hover:border-surface-400 dark:hover:border-surface-500'
    "
    :style="{ width }"
    @click="show"
  >
    <span v-if="cards.length" class="flex flex-wrap gap-2">
      <PlayingCardText v-for="(card, i) in cards" :key="i" :card="card" />
    </span>
  </button>
</template>
