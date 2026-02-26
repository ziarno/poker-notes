<script lang="ts">
export const CARD_TEXT_WIDTH_REM = 3
</script>

<script setup lang="ts">
import { Card } from '@/types/PlayingCards.type.ts'
import SuitIcon from '@/ui/components/SuitIcon.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <span
    class="inline-flex items-center justify-center text-2xl font-semibold"
    :style="{ width: `${CARD_TEXT_WIDTH_REM}rem` }"
  >
    {{ card.rank === 'T' ? '10' : card.rank }}<SuitIcon :suit="card.suit" />
  </span>
</template>
