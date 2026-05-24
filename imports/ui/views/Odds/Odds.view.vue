<script setup lang="ts">
import Dialog from '@volt/Dialog.vue'
import SelectButton from '@volt/SelectButton.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCardKeyboard } from '@/composables/useCardKeyboard'
import {
  BOARD_MAX_CARDS,
  useSelectedCards,
} from '@/composables/useSelectedCards'
import DashedAddButton from '@/ui/components/DashedAddButton.vue'
import ThemeToggle from '@/ui/components/ThemeToggle.vue'
import Board from '@/ui/views/Odds/components/Board.vue'
import CardInput from '@/ui/views/Odds/components/CardInput.vue'
import OddsPlayer from '@/ui/views/Odds/components/OddsPlayer.vue'

const { t } = useI18n()
const { visible: keyboardVisible } = useCardKeyboard()
const { players, board, exhaustive, addPlayer, removeLastPlayer, reset } =
  useSelectedCards()

const infoVisible = ref(false)

const boardLabel = computed(() => {
  const n = board.value.length
  const stage = n === 5 ? 'RIVER' : n === 4 ? 'TURN' : 'FLOP'
  return `${stage} · ${n} / ${BOARD_MAX_CARDS}`
})

const modeOptions = computed(() => [
  { label: t('fast'), value: false },
  { label: t('precise'), value: true },
])
</script>

<template>
  <div
    class="px-[18px] pt-[18px] pb-6 transition-[padding,opacity,transform]
      duration-300 ease-in-out"
    :class="{ '!pb-60': keyboardVisible }"
  >
    <header class="flex items-center justify-between pb-[6px]">
      <div>
        <div
          class="text-ft-ink-50 font-sans text-[13px] font-semibold
            tracking-[0.18em] uppercase"
        >
          {{ t('odds') }}
        </div>
        <div class="font-sans text-[22px] font-bold tracking-[-0.02em]">
          {{ t('win_chances') }}
        </div>
      </div>
      <ThemeToggle />
    </header>

    <Board :label="boardLabel">
      <CardInput
        v-model="board"
        :max="BOARD_MAX_CARDS"
        :label="t('board')"
        on-felt
      />
    </Board>

    <div class="mb-4 flex items-center gap-[6px] pt-[14px] pb-2">
      <SelectButton
        v-model="exhaustive"
        :options="modeOptions"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        size="small"
      />
      <button
        type="button"
        class="border-ft-ink-10 bg-ft-surface text-ft-ink-70 inline-flex h-8 w-8
          cursor-pointer items-center justify-center rounded-full border"
        :aria-label="t('fast') + ' / ' + t('precise')"
        @click="infoVisible = true"
      >
        <i class="pi pi-info-circle"></i>
      </button>
      <button
        type="button"
        class="bg-ft-surface border-ft-ink-10 text-ft-ink-70 hover:text-ft-ink
          hover:border-ft-ink-30 ml-auto inline-flex cursor-pointer items-center
          gap-[6px] rounded-full border px-3 py-[6px] font-sans text-xs"
        @click="reset"
      >
        <i class="pi pi-trash text-[13px]"></i>
        <span>{{ t('reset') }}</span>
      </button>
    </div>

    <div class="mt-1 flex flex-col gap-2">
      <OddsPlayer v-for="(_, i) in players" :key="i" :index="i" />
    </div>

    <div class="mt-[14px] flex items-center justify-center gap-2">
      <DashedAddButton block :label="t('add_player')" @click="addPlayer" />
      <button
        v-if="players.length > 2"
        type="button"
        class="text-ft-ink-50 hover:text-ft-red inline-flex cursor-pointer
          items-center gap-[6px] border-none bg-transparent px-[10px] py-2
          font-sans text-xs"
        @click="removeLastPlayer"
      >
        <i class="pi pi-minus"></i>
        <span>{{ t('remove_player') }}</span>
      </button>
    </div>

    <Dialog
      class="w-75"
      v-model:visible="infoVisible"
      modal
      :header="t('fast') + ' / ' + t('precise')"
    >
      <div class="flex flex-col gap-3 text-sm">
        <div>
          <p class="font-semibold">{{ t('fast') }}</p>
          <p class="text-ft-ink-50">{{ t('fast_description') }}</p>
        </div>
        <div>
          <p class="font-semibold">{{ t('precise') }}</p>
          <p class="text-ft-ink-50">{{ t('precise_description') }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>
