<script setup lang="ts">
import { ComputedRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSelectedCards } from '@/composables/useSelectedCards.ts'
import { PlayerInOddsCalculator } from '@/types/PlayingCards.type.ts'
import CardInput from '@/ui/components/CardInput.vue'

const props = defineProps<{ index: number }>()

const { t } = useI18n()
const { players, odds } = useSelectedCards()
const player = computed(
  () => players.value[props.index]
) as ComputedRef<PlayerInOddsCalculator>
const label = computed(() => t('player', { n: props.index + 1 }))
const playerOdds = computed(() => odds.value?.[props.index])
</script>

<template>
  <div class="flex items-center gap-3">
    <h2
      class="text-surface-600 dark:text-surface-300 w-24 shrink-0 text-lg font-medium"
    >
      {{ label }}
    </h2>
    <CardInput
      v-model="player.cards"
      :max="2"
      :label="label"
      class="shrink-0"
    />
    <div v-if="playerOdds" class="grow-1 text-right text-sm">
      <p class="font-semibold text-green-600 dark:text-green-400">
        {{ playerOdds.wins }}
      </p>
      <p class="text-surface-500 dark:text-surface-400">
        {{ playerOdds.ties }}
      </p>
    </div>
  </div>
</template>
