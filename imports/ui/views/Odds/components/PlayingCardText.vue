<script lang="ts">
export const CARD_TEXT_WIDTH_REM = 2.6
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { SUITS_ICONS } from '@/constants/playingCrads.const.ts'
import { Card } from '@/types/PlayingCards.type.ts'

const { card } = defineProps<{ card: Card }>()

const rank = computed(() => (card.rank === 'T' ? '10' : card.rank))
const suit = computed(() => SUITS_ICONS[card.suit])
const isRed = computed(() => card.suit === 'hearts' || card.suit === 'diamonds')
</script>

<template>
  <span
    class="font-sans inline-flex h-12 w-[34px] flex-col items-center
      justify-center rounded-[5px] border border-black/12 bg-white leading-none
      font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
    :class="isRed ? 'text-ft-red' : 'text-ft-ink'"
  >
    <span class="text-sm">{{ rank }}</span>
    <span class="mt-[2px] text-[19px]">{{ suit }}</span>
  </span>
</template>
