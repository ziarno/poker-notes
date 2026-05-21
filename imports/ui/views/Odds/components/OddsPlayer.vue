<script setup lang="ts">
import { ComputedRef, computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import ProgressBar from '@volt/ProgressBar.vue'
import Skeleton from '@volt/Skeleton.vue'

import { useCardKeyboard } from '@/composables/useCardKeyboard.ts'
import { useSelectedCards } from '@/composables/useSelectedCards.ts'
import { Card, PlayerInOddsCalculator } from '@/types/PlayingCards.type.ts'
import PlayingCardText from '@/ui/views/Odds/components/PlayingCardText.vue'

const props = defineProps<{ index: number }>()

const { t } = useI18n()
const { players, odds, calculating } = useSelectedCards()

const player = computed(
  () => players.value[props.index]
) as ComputedRef<PlayerInOddsCalculator>
const label = computed(() => t('player', { n: props.index + 1 }))
const playerOdds = computed(() => odds.value?.[props.index])

// Two-way ref into player.cards so useCardKeyboard can mutate it
const cardsModel = computed<Card[]>({
  get: () => player.value.cards,
  set: v => {
    player.value.cards = v
  },
})

const { show, isActive, onActiveIdChanged } = useCardKeyboard(
  cardsModel,
  2,
  label.value
)

const buttonRef = useTemplateRef<HTMLButtonElement>('button')
function scrollIntoView() {
  if (isActive.value) {
    setTimeout(() => {
      buttonRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }
}
onActiveIdChanged(scrollIntoView)

const isEmpty = computed(() => player.value.cards.length === 0)

const showSkeleton = computed(
  () => calculating.value && player.value.cards.length === 2
)

const emptySlots = computed(() => Math.max(0, 2 - player.value.cards.length))
</script>

<template>
  <button
    ref="button"
    type="button"
    class="bg-ft-surface flex w-full cursor-pointer items-center gap-[10px]
      rounded-[14px] border py-3 pr-3 pl-[14px] text-left
      transition-[border-color,box-shadow,opacity]"
    :class="[
      isActive
        ? 'border-ft-ink-50 shadow-[0_0_0_3px_rgba(13,20,17,0.06)]'
        : 'border-ft-ink-10',
      isEmpty ? 'opacity-90' : '',
    ]"
    @click="show"
  >
    <div class="flex shrink-0 items-center gap-[5px]">
      <PlayingCardText
        v-for="(card, i) in player.cards"
        :key="i"
        :card="card"
      />
      <span
        v-for="i in emptySlots"
        :key="`p${i}`"
        class="border-ft-ink-30 h-12 w-[34px] rounded-[5px] border-[1.5px]
          border-dashed bg-transparent"
      ></span>
    </div>

    <div class="min-w-0 flex-1">
      <div class="text-ft-ink-70 text-[16px] font-semibold">
        {{ label }}
      </div>
      <ProgressBar
        :value="playerOdds?.winsPercentage ?? 0"
        :show-value="false"
        class="bg-ft-ink-10! mt-2 h-2! rounded-full!"
        :style="{ '--p-primary-color': 'var(--color-ft-green)' }"
      />
    </div>

    <div
      class="center flex h-[54px] w-[90px] shrink-0 flex-col items-center
        justify-center gap-1"
      :style="{ visibility: isEmpty ? 'hidden' : 'visible' }"
    >
      <template v-if="showSkeleton">
        <Skeleton width="3rem" height="1.25rem" />
        <Skeleton width="2rem" height="1rem" />
      </template>
      <template v-else-if="playerOdds">
        <span
          class="text-ft-ink font-mono text-[20px] font-bold tracking-[-0.02em]
            tabular-nums"
        >
          {{ playerOdds.winsPercentageString }}
        </span>
        <span
          class="text-ft-ink-50 font-mono text-[15px] font-medium
            tracking-[-0.01em] tabular-nums"
        >
          {{ playerOdds.tiesPercentageString }}
        </span>
      </template>
    </div>
  </button>
</template>
