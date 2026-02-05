<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import Message from '@volt/Message.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { addTransfer } from '@/api/methods'
import { useIsGameCreator } from '@/composables'
import { POT_KEY_NAME } from '@/constants/transfers.const.ts'
import { Game, Transfer } from '@/types'
import GameSummaryCopy from '@/ui/views/GameDetails/components/GameSummaryCopy.vue'
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
const isCreator = useIsGameCreator(() => game)

const isOngoing = computed(() => isGameOngoing(game))
const isInOutEqual = computed(() => isGameInOutEqual(game))

const settlement = computed<Transfer[]>(() => {
  if (!isGameFinished(game)) return []
  return getGameSettlement(game)
})

function addToTransfers(transfer: Transfer) {
  addTransfer({ gameId: game._id, transfer })
}
</script>

<template>
  <div class="mb-10">
    <p v-if="isOngoing" class="text-surface-400 text-center text-sm">
      {{ t('settlement_info') }}
    </p>
    <Message
      icon="pi pi-exclamation-triangle"
      size="small"
      v-else-if="!isInOutEqual"
      severity="warn"
      variant="simple"
      class="justify-center"
      >{{ t('settlement_warning') }}</Message
    >
    <template v-else>
      <DataTable :value="settlement">
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
        <Column class="w-0" v-if="isCreator">
          <template #body="slotProps">
            <SecondaryButton
              outlined
              icon="pi pi-check"
              @click="addToTransfers(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
      <div class="mt-10 flex justify-center">
        <GameSummaryCopy v-if="isGameFinished(game)" :game="game" />
      </div>
    </template>
  </div>
</template>
