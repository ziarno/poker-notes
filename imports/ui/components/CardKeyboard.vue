<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { onClickOutside } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'

import { useCardKeyboard } from '@/composables/useCardKeyboard'
import { SUITS_ICONS } from '@/constants/playingCrads.const'
import { Card, CardRank, CardSuit } from '@/types/PlayingCards.type.ts'
import SuitIcon from '@/ui/components/SuitIcon.vue'

const { visible, addCard, removeLastCard, hide } = useCardKeyboard()

const ranksTopRow = ['A', 'K', 'Q', 'J', 'T'] as const
const ranksBottomRow = ['9', '8', '7', '6', '5', '4', '3', '2'] as const
const ranksRows = [ranksBottomRow, ranksTopRow]
const suits = Object.keys(SUITS_ICONS) as CardSuit[]

const selectedRank = ref<CardRank | null>(null)
const selectedSuit = ref<CardSuit | null>(null)
const card = computed(() => ({
  rank: selectedRank.value,
  suit: selectedSuit.value,
}))

function maybeAddCard() {
  if (card.value.rank && card.value.suit) {
    setTimeout(() => {
      addCard(card.value as Card)
      reset()
    }, 100)
  }
}

function selectRank(rank: CardRank) {
  selectedRank.value = rank
  maybeAddCard()
}

function selectSuit(suit: CardSuit) {
  selectedSuit.value = suit
  maybeAddCard()
}

function reset() {
  selectedRank.value = null
  selectedSuit.value = null
}

function close() {
  reset()
  hide()
}

const refContainer = useTemplateRef('container')
onClickOutside(refContainer, close)
</script>

<template>
  <Transition name="slide-up">
    <div
      ref="container"
      v-if="visible"
      class="bg-surface-0 dark:bg-surface-800 border-surface-200 dark:border-surface-700 fixed inset-x-0 bottom-0 z-100 border-t py-3"
    >
      <div
        v-for="row in ranksRows"
        class="mt-3 flex flex-wrap justify-center gap-1"
      >
        <SecondaryButton
          outlined
          v-for="rank in row"
          :key="rank"
          class="h-10 w-10 text-lg font-semibold transition-colors"
          :class="selectedRank === rank && 'border-2 border-gray-500!'"
          @click="selectRank(rank)"
        >
          {{ rank === 'T' ? '10' : rank }}
        </SecondaryButton>
      </div>

      <div class="mt-5 flex justify-center gap-3 p-1">
        <SecondaryButton
          @click="close"
          icon="pi pi-chevron-down"
          class="h-12 w-14!"
        />

        <SecondaryButton
          outlined
          v-for="suit in suits"
          :key="suit"
          class="h-12 w-14 text-2xl text-black! transition-colors"
          :class="[selectedSuit === suit && 'border-2 border-gray-500!']"
          @click="selectSuit(suit)"
        >
          <SuitIcon :suit="suit" />
        </SecondaryButton>

        <SecondaryButton
          @click="removeLastCard"
          icon="pi pi-delete-left"
          class="h-12 w-14!"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
