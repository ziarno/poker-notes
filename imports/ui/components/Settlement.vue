<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import Column from 'primevue/column'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { POT_KEY_NAME } from '@/constants/transfers.const.ts'
import { Game, Transfer } from '@/types'
import {
  getGameSettlement,
  isGameFinished,
  isGameInOutEqual,
  isGameOngoing,
} from '@/utils/game.utils.ts'

const { game } = defineProps<{
  game: Game
}>()
const { t } = useI18n()

const isOngoing = computed(() => isGameOngoing(game))
const isInOutEqual = computed(() => isGameInOutEqual(game))

const settlement = computed<Transfer[]>(() => {
  if (!isGameFinished(game)) return []
  return getGameSettlement(game)
})
</script>

<template>
  <div class="mb-10">
    <p v-if="isOngoing" class="text-surface-400 text-center text-sm">
      {{ t('settlement_info') }}
    </p>
    <p v-else-if="!isInOutEqual" class="text-surface-400 text-center text-sm">
      {{ t('settlement_warning') }}
    </p>
    <DataTable v-else :value="settlement">
      <Column field="from" :header="t('from')">
        <template #body="slotProps">
          <span v-if="slotProps.data.from === POT_KEY_NAME">{{
            t('pot').toUpperCase()
          }}</span>
          <span v-else>{{ slotProps.data.from }}</span>
        </template>
      </Column>
      <Column field="to" :header="t('to')">
        <template #body="slotProps">
          <span v-if="slotProps.data.to === POT_KEY_NAME">{{
            t('pot').toUpperCase()
          }}</span>
          <span v-else>{{ slotProps.data.to }}</span>
        </template>
      </Column>
      <Column
        field="value"
        :header="t('value')"
        class="w-0 pr-0 pl-0"
        bodyClass="!text-center !p-0"
      />
    </DataTable>
    <slot></slot>
  </div>
</template>
