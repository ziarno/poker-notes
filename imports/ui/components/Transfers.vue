<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  addTransfer as addTransferMethod,
  removeTransfer as removeTransferMethod,
} from '@/api/methods/games.methods'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import { POT_KEY_NAME } from '@/constants/transfers.const.ts'
import { Game, Transfer } from '@/types'
import InputNewTransfer from '@/ui/components/InputNewTransfer.vue'

const { game } = defineProps<{
  game: Game
}>()

const { t } = useI18n()
const isAddingNewTransfer = ref(false)

async function addTransfer(transfer: Transfer) {
  addTransferMethod({ gameId: game._id!, transfer })
  isAddingNewTransfer.value = false
}

function removeTransfer(transfer: Transfer) {
  return removeTransferMethod({ gameId: game._id!, transfer })
}

const confirmRemoveTransfer = useDeleteConfirmationDialog(removeTransfer)
</script>

<template>
  <DataTable
    :value="game.transfers"
    v-if="game.transfers.length"
    table-class="mb-5"
  >
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
    <Column class="w-0">
      <template #body="{ data }">
        <SecondaryButton
          outlined
          icon="pi pi-times"
          @click="confirmRemoveTransfer(data)"
        />
      </template>
    </Column>
  </DataTable>
  <SecondaryButton
    class="mb-2"
    size="small"
    @click="isAddingNewTransfer = true"
    v-if="!isAddingNewTransfer"
    icon="pi pi-plus"
    icon-pos="right"
    :label="t('add_transfer')"
  />

  <InputNewTransfer
    v-if="isAddingNewTransfer"
    :game="game"
    class=""
    @add="addTransfer"
    @cancel="isAddingNewTransfer = false"
  />
</template>
