<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import pokerTableUrl from '@/assets/poker-table.svg'
import {
  BOARD_MAX_CARDS,
  useSelectedCards,
} from '@/composables/useSelectedCards'
import CardInput from '@/ui/components/CardInput.vue'
import PlayerCards from '@/ui/components/PlayerCards.vue'

const { t } = useI18n()
const { players, board, addPlayer, removeLastPlayer, reset } =
  useSelectedCards()

const boardRef = useTemplateRef('boardRef')

function onBoardClick() {
  boardRef.value?.$el?.click()
}
</script>

<template>
  <div class="xs:p-4">
    <h1
      class="text-surface-700 dark:text-surface-0 mb-8 text-center text-2xl font-semibold"
    >
      {{ t('odds') }}
    </h1>

    <div class="relative my-10">
      <img :src="pokerTableUrl" class="w-full" alt="Poker table" />
      <div
        @click="onBoardClick"
        class="absolute inset-0 flex items-center justify-center"
      >
        <CardInput
          ref="boardRef"
          v-model="board"
          :max="BOARD_MAX_CARDS"
          :label="t('board')"
        />
      </div>
    </div>
    <div class="my-6 flex justify-end gap-2">
      <SecondaryButton
        v-if="players.length > 2"
        size="small"
        @click="removeLastPlayer"
        icon="pi pi-minus"
        icon-pos="right"
        :label="t('remove_player')"
      />
      <SecondaryButton
        size="small"
        @click="addPlayer"
        icon="pi pi-plus"
        icon-pos="right"
        :label="t('add_player')"
      />
      <SecondaryButton
        size="small"
        @click="reset"
        icon="pi pi-trash"
        icon-pos="right"
        :label="t('reset')"
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <PlayerCards
        class="flex-grow-1 basis-0"
        v-for="(_, i) in players"
        :index="i"
      />
    </div>
  </div>
</template>
