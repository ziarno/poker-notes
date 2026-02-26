<script setup lang="ts">
import { computed } from 'vue'

import { PLAYING_CARDS } from '@/constants/playingCrads.const.ts'
import { Card, CardRank, CardSuit } from '@/types/PlayingCards.type.ts'

type Props = {
  card: Card
}

const { card } = defineProps<Props>()

function getNumber({ suit, rank }: Card) {
  const RANK_MAP: Record<CardRank, number> = {
    A: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    T: 9,
    J: 10,
    Q: 11,
    K: 12,
  }
  const SUIT_MULTIPLIER: Record<CardSuit, number> = {
    hearts: 0,
    diamonds: 1,
    spades: 2,
    clubs: 3,
  }
  return RANK_MAP[rank] + SUIT_MULTIPLIER[suit] * 13
}

const cardNumber = computed(() => getNumber(card))
const cardAscii = computed(() => PLAYING_CARDS[cardNumber.value])
const cardColorClass = computed(() =>
  cardNumber.value <= 25 ? 'text-red-700' : 'text-black'
)
</script>

<template>
  <span :class="['text-7xl', cardColorClass]">{{ cardAscii }}</span>
</template>
