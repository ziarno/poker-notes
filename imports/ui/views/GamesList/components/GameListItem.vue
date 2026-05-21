<script setup lang="ts">
import Tag from '@volt/Tag.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFormattedDate } from '@/composables'
import { Game } from '@/types'
import { CardSuit } from '@/types/PlayingCards.type.ts'
import SuitWatermark from '@/ui/components/SuitWatermark.vue'
import { getGameTotal } from '@/utils'

const props = defineProps<{
  game: Game
  index?: number
}>()

const { t } = useI18n()

const date = useFormattedDate(props.game.date, 'E, dd.MM.yyyy')
const pot = computed(() => getGameTotal(props.game))

const suitCycle: CardSuit[] = ['spades', 'hearts', 'diamonds', 'clubs']
const watermarkSuit = computed(() => suitCycle[(props.index ?? 0) % 4]!)
</script>

<template>
  <RouterLink class="block text-inherit no-underline" :to="`/${game._id}`">
    <article
      class="bg-ft-surface border-ft-ink-10 relative flex cursor-pointer
        flex-row justify-between gap-2 overflow-hidden rounded-[14px] border
        p-[14px] transition-colors hover:border-[rgba(13,20,17,.16)]"
    >
      <div class="absolute -right-0 -bottom-6">
        <SuitWatermark :suit="watermarkSuit" :size="120" :opacity="0.05" />
      </div>

      <div class="gap-2">
        <div class="mb-5 font-sans text-[18px] font-semibold">
          {{ game.title }}
        </div>
        <div class="text-ft-ink-70 relative mr-5 font-sans text-sm">
          <template v-for="(p, i) in game.players" :key="p.name">
            <span>{{ p.name }}</span
            ><span v-if="i < game.players.length - 1">, </span>
          </template>
        </div>
      </div>

      <div class="flex flex-col justify-between gap-4">
        <div class="flex flex-col items-end gap-1">
          <div class="z-1 flex items-center gap-[4px]">
            <Tag
              :icon="`pi pi-user text-ft-ink-50! text-[10px]!`"
              class="bg-ft-surface! border-ft-ink-10! text-ft-ink! gap-[4px]!
                rounded-full! border! px-[8px]! py-[3px]! text-[12px]!
                font-normal!"
            >
              <span class="font-mono font-semibold tabular-nums">{{
                game.players.length
              }}</span>
            </Tag>
            <Tag
              :icon="`pi pi-wallet text-ft-ink-50! text-[10px]!`"
              class="bg-ft-surface! border-ft-ink-10! text-ft-ink! gap-[4px]!
                rounded-full! border! px-[8px]! py-[3px]! text-[12px]!
                font-normal!"
            >
              <span class="font-mono font-semibold tabular-nums">{{
                game.buyIn
              }}</span>
            </Tag>
          </div>
          <div class="text-ft-ink-50 font-mono text-[12px] whitespace-nowrap">
            {{ date }}
          </div>
        </div>

        <div
          class="text-ft-ink-50 relative flex items-baseline justify-end gap-1
            font-sans text-[13px]"
        >
          <span class="text-ft-ink-50 text-[13px]">{{
            t('pot').toLowerCase()
          }}</span>
          <span
            class="text-ft-ink font-mono text-[17px] font-bold
              tracking-[-0.02em] tabular-nums"
          >
            {{ pot }}
          </span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>
