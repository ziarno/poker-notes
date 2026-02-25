<script setup lang="ts">
import TimesIcon from '@primevue/icons/times'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { computed, ref } from 'vue'

import { useCardKeyboard } from '@/composables/useCardKeyboard'
import { SUITS_ICONS, SUIT_ICONS_TO_SUIT } from '@/constants/playingCrads.const'
import { Card, CardRank, CardSuit } from '@/types/PlayingCards.type.ts'

const { visible, handleSelect, hide } = useCardKeyboard()

const ranksTopRow = ['A', 'K', 'Q', 'J', 'T'] as const
const ranksBottomRow = ['9', '8', '7', '6', '5', '4', '3', '2'] as const
const ranksRows = [ranksBottomRow, ranksTopRow]
const suitsIcons = Object.values(SUITS_ICONS)

const selectedRank = ref<CardRank | null>(null)
const selectedSuit = ref<CardSuit | null>(null)
const card = computed(() => ({
  rank: selectedRank.value,
  suit: selectedSuit.value,
}))

function checkEmit() {
  if (card.value.rank && card.value.suit) {
    setTimeout(() => {
      handleSelect(card.value as Card)
      reset()
    }, 100)
  }
}

function selectRank(rank: CardRank) {
  selectedRank.value = rank
  checkEmit()
}

function selectSuit(suit: CardSuit) {
  selectedSuit.value = suit
  checkEmit()
}

function reset() {
  selectedRank.value = null
  selectedSuit.value = null
}

function close() {
  reset()
  hide()
}

function getSuitColor(suit: string): string {
  return suit === SUITS_ICONS.hearts || suit === SUITS_ICONS.diamonds
    ? 'text-red-500!'
    : 'text-black dark:text-white!'
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="visible"
      class="bg-surface-0 dark:bg-surface-800 border-surface-200 dark:border-surface-700 fixed inset-x-0 bottom-0 z-100 border-t px-2 pt-10 pb-10"
    >
      <SecondaryButton
        variant="text"
        rounded
        @click="close"
        class="absolute! top-2 right-2 p-2"
      >
        <template #icon>
          <TimesIcon />
        </template>
      </SecondaryButton>

      <div
        v-for="row in ranksRows"
        class="flex flex-wrap justify-center gap-1 pt-4"
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

      <div class="mt-5 flex justify-center gap-3">
        <SecondaryButton
          outlined
          v-for="suitIcon in suitsIcons"
          :key="suitIcon"
          class="h-12 w-14 text-2xl text-black! transition-colors"
          :class="[
            getSuitColor(suitIcon),
            selectedSuit === SUIT_ICONS_TO_SUIT[suitIcon] &&
              'border-2 border-gray-500!',
          ]"
          @click="selectSuit(SUIT_ICONS_TO_SUIT[suitIcon])"
        >
          {{ suitIcon }}
        </SecondaryButton>
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
