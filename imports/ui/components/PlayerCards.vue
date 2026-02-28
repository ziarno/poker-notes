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
  <div
    class="border-surface-200 dark:border-surface-700 flex flex-col items-center gap-2 rounded-lg border p-3"
  >
    <h2
      class="text-surface-500 dark:text-surface-400 text-xs font-medium tracking-wide uppercase"
    >
      {{ label }}
    </h2>
    <CardInput ref="cardInput" v-model="player.cards" :max="2" :label="label" />
    <div class="flex h-4 gap-3 text-sm">
      <p
        v-if="playerOdds"
        class="font-semibold text-green-600 dark:text-green-400"
      >
        {{ playerOdds.wins }}
      </p>
      <p v-if="playerOdds" class="text-surface-500 dark:text-surface-400">
        {{ playerOdds.ties }}
      </p>
    </div>
  </div>
</template>
