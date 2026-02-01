<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import { DataTableRowSelectEvent } from 'primevue/datatable'
import Row from 'primevue/row'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { addPlayer as addPlayerMethod } from '@/api/methods/games.methods'
import { Game, Player } from '@/types'
import Balance from '@/ui/components/Balance.vue'
import InputNewPlayer from '@/ui/components/InputNewPlayer.vue'
import EditPlayerDialog from '@/ui/components/dialog/EditPlayerDialog.vue'
import { getTotalIn, getTotalOut, isNumber } from '@/utils'

const { game } = defineProps<{
  game: Game
}>()

const { t } = useI18n()

const isAddingNewPlayer = ref(false)
const editingPlayer = ref<Player | null>(null)

const tableData = computed(() => {
  return game.players.map(player => ({
    ...player,
    balance: isNumber(player.out) ? player.out - player.in : null,
  }))
})
const totalIn = computed(() => getTotalIn(game).toString() ?? '')
const totalOut = computed(() => getTotalOut(game).toString() ?? '')

function addPlayer(name: string) {
  addPlayerMethod({
    gameId: game._id!,
    player: {
      name,
      in: game.buyIn,
    },
  })
  isAddingNewPlayer.value = false
}

function onRowClick(e: DataTableRowSelectEvent<Player>) {
  editingPlayer.value = e.data
}
</script>

<template>
  <DataTable
    selection-mode="single"
    @row-select="onRowClick"
    dataKey="name"
    ref="data-table"
    :value="tableData"
    class="mt-4"
  >
    <Column
      field="name"
      body-class="max-w-0 !pr-1 min-w-32 overflow-hidden text-ellipsis safari:!pl-1"
    ></Column>
    <Column
      field="in"
      :header="t('buy_in')"
      class="w-0"
      headerClass="thead-center safari:!px-1"
      bodyClass="!text-center"
    >
    </Column>
    <Column
      field="out"
      :header="t('buy_out')"
      class="w-0"
      headerClass="thead-center safari:!px-1"
      bodyClass="!text-center"
    >
    </Column>
    <Column
      field="balance"
      :header="t('balance')"
      class="w-0 min-w-[80px]"
      headerClass="thead-center safari:!px-1"
      bodyClass="!text-center"
    >
      <template #body="slotProps">
        <Balance :value="slotProps.data.balance" />
      </template>
    </Column>
    <ColumnGroup type="footer">
      <Row>
        <Column :colspan="4" footer-class="pl-0 pr-0 pt-2 pb-2">
          <template #footer>
            <SecondaryButton
              class="mt-1 mb-1"
              size="small"
              @click="isAddingNewPlayer = true"
              v-if="!isAddingNewPlayer"
              icon="pi pi-plus"
              icon-pos="right"
              :label="t('add_player')"
            />
            <InputNewPlayer
              show-cancel
              v-else
              :exclude-names="game.players.map(p => p.name)"
              @add="addPlayer"
              @cancel="isAddingNewPlayer = false"
            />
          </template>
        </Column>
      </Row>
      <Row>
        <Column :footer="t('sum')" footer-style="text-align: right;" />
        <Column
          :footer="totalIn"
          footer-class="!text-center game-details-footer-row"
        />
        <Column
          :footer="totalOut"
          footer-class="!text-center game-details-footer-row"
        />
        <Column />
      </Row>
    </ColumnGroup>
  </DataTable>
  <EditPlayerDialog
    :player="editingPlayer"
    @hide="editingPlayer = null"
    :game="game"
  />
</template>

<style>
.thead-center > div {
  justify-content: center;
}
</style>
