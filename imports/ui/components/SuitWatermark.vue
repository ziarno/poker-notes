<script setup lang="ts">
import { computed } from 'vue'

import { SUITS_ICONS } from '@/constants/playingCrads.const.ts'
import { CardSuit } from '@/types/PlayingCards.type.ts'

const props = withDefaults(
  defineProps<{
    suit: CardSuit
    size?: number
    /** opacity for the suit tint (0..1) */
    opacity?: number
    /** override the auto-picked color (e.g. for a green spade on the winner banner) */
    color?: string
  }>(),
  { size: 108, opacity: 0.08 }
)

const char = computed(() => SUITS_ICONS[props.suit])
const isRed = computed(
  () => props.suit === 'hearts' || props.suit === 'diamonds'
)
const autoColorClass = computed(() =>
  props.color ? '' : isRed.value ? 'text-ft-red' : 'text-ft-ink'
)
</script>

<template>
  <span
    aria-hidden="true"
    class="pointer-events-none inline-block leading-none select-none"
    :class="autoColorClass"
    :style="{
      fontSize: size + 'px',
      opacity,
      ...(color ? { color } : {}),
    }"
    >{{ char }}</span
  >
</template>
