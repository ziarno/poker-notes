<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useI18n } from 'vue-i18n'

import {
  BOARD_MAX_CARDS,
  PLAYER_MAX_CARDS,
  useSelectedCards,
} from '@/composables/useSelectedCards'
import CardInput from '@/ui/components/CardInput.vue'

const { t } = useI18n()
const { players, board, addPlayer, removeLastPlayer, reset } = useSelectedCards()
</script>

<template>
  <div class="p-4">
    <h1
      class="text-surface-700 dark:text-surface-0 mb-8 text-2xl font-semibold"
    >
      {{ t('odds') }}
    </h1>

    <div class="flex flex-col gap-3">
      <div
        v-for="(player, i) in players"
        :key="i"
        class="flex items-center gap-3"
      >
        <h2
          class="text-surface-600 dark:text-surface-300 w-24 shrink-0 text-lg font-medium"
        >
          {{ t('player', { n: i + 1 }) }}
        </h2>
        <CardInput v-model="player.cards" :max="PLAYER_MAX_CARDS" />
      </div>
    </div>

    <div class="mt-8 flex justify-end gap-2">
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
    </div>

    <div class="mt-6 flex flex-col items-center gap-3">
      <h2 class="text-surface-600 dark:text-surface-300 text-lg font-medium">
        {{ t('board') }}
      </h2>
      <CardInput v-model="board" :max="BOARD_MAX_CARDS" />
    </div>

    <div class="mt-8 flex justify-end gap-2">
      <SecondaryButton
        size="small"
        @click="reset"
        icon="pi pi-trash"
        icon-pos="right"
        :label="t('reset')"
      />
    </div>
  </div>
</template>
