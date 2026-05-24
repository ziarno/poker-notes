<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { FinishedGame, Game } from '@/types'
import SuitWatermark from '@/ui/components/SuitWatermark.vue'
import GameSummaryCopy from '@/ui/views/GameDetails/components/GameSummaryCopy.vue'
import { isGameFinished, isGameInOutEqual } from '@/utils/game.utils.ts'

const { game } = defineProps<{
  game: Game
}>()

const { t } = useI18n()

const finished = computed(() => isGameFinished(game))
const settled = computed(() => isGameInOutEqual(game))

const winner = computed(() => {
  if (!finished.value || !settled.value) return null
  const sorted = [...game.players].sort(
    (a, b) => (b.out ?? 0) - b.in - ((a.out ?? 0) - a.in)
  )
  const top = sorted[0]
  if (!top || (top.out ?? 0) - top.in <= 0) return null
  return { name: top.name, delta: (top.out ?? 0) - top.in }
})
</script>

<template>
  <Transition name="ft-banner" appear>
    <div v-if="winner">
      <!-- Clipping wrapper enables the grid-row height-collapse animation. -->
      <div class="min-h-0 overflow-hidden">
        <div
          class="from-ft-green-soft to-ft-green-tint border-ft-green-tint
            relative mt-4 mb-10 flex flex-col gap-3 overflow-hidden
            rounded-[18px] border bg-gradient-to-br p-4"
        >
          <div class="absolute right-2 -bottom-6">
            <SuitWatermark
              suit="spades"
              :size="140"
              :opacity="0.12"
              color="var(--color-ft-green)"
            />
          </div>
          <div class="relative z-10 flex items-center gap-[14px]">
            <div class="flex-1">
              <div
                class="text-ft-green-ink font-sans text-[12px] font-semibold
                  tracking-[0.2em] uppercase"
              >
                {{ t('winner_of_evening') }}
              </div>
              <div
                class="text-ft-green-ink mt-[2px] font-sans text-[22px]
                  font-bold tracking-[-0.02em]"
              >
                {{ winner.name }}
              </div>
            </div>
            <div
              class="text-ft-green font-mono text-[32px] leading-none font-bold
                tracking-[-0.03em] tabular-nums"
            >
              +{{ winner.delta }}
            </div>
          </div>
          <div class="relative z-10 flex justify-end">
            <GameSummaryCopy :game="game as FinishedGame" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
