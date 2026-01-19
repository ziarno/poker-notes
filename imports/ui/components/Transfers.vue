<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import { useI18n } from 'vue-i18n'

import { Game, Transfer } from '@/types'
import InputNewTransfer from '@/ui/components/InputNewTransfer.vue'

const { game } = defineProps<{
  game: Game
}>()

const { t } = useI18n()

function addTransfer(transfer: Transfer) {
  Meteor.callAsync('addTransfer', game._id, transfer)
}

function removeTransfer(transfer: Transfer) {
  Meteor.callAsync('removeTransfer', game._id, transfer)
}
</script>

<template>
  <DataTable :value="game.transfers">
    <Column field="from" :header="t('from')" />
    <Column field="to" :header="t('to')" />
    <Column
      field="value"
      :header="t('value')"
      class="w-0 pr-0 pl-0"
      bodyClass="!text-center !p-0"
    />
    <Column class="w-0">
      <template #body="{ data }">
        <SecondaryButton outlined icon="pi pi-times" @click="removeTransfer(data)" />
      </template>
    </Column>
  </DataTable>
  <InputNewTransfer :game="game" class="mt-5" @add="addTransfer" />
</template>
