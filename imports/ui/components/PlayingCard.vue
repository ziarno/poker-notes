<script setup lang="ts">
import { computed } from 'vue'

import { PLAYING_CARDS } from '@/constants/playingCrads.const.ts'
import { CardRank, CardSuit } from '@/types/PlayingCards.type.ts'

type PropsWithRank = {
  number: number
  suit: never
  rank: never
}

type PropsWithRankAndSuit = {
  number: never
  suit: CardSuit
  rank: CardRank
}

type Props = PropsWithRank | PropsWithRankAndSuit

const { number, rank, suit } = defineProps<Props>()

function getNumber(rank: CardRank, suit: CardSuit) {
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
    10: 9,
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

const cardNumber = computed(() => number ?? getNumber(rank, suit))
const card = computed(() => PLAYING_CARDS[cardNumber.value])
const cardColorClass = computed(() =>
  number <= 25 ? 'text-red-700' : 'text-black'
)
</script>

<template>
  <span :class="['text-3xl', cardColorClass]">{{ card }}</span>
</template>

<style scoped></style>
