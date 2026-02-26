<script setup lang="ts">
import { computed } from 'vue'

import { SUITS_ICONS } from '@/constants/playingCrads.const'
import { CardSuit } from '@/types/PlayingCards.type.ts'

const props = defineProps<{ suit: CardSuit }>()

const icon = computed(() => SUITS_ICONS[props.suit])
const isRed = computed(
  () => props.suit === 'hearts' || props.suit === 'diamonds',
)
</script>

<template>
  <span :class="isRed ? 'text-red-500' : 'text-black dark:text-white'">
    {{ icon }}
  </span>
</template>
