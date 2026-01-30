<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  addPlayer as addPlayerMethod,
  removePlayer as removePlayerMethod,
  setPlayerIn,
  setPlayerOut,
} from '@/api/methods/games.methods'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import { Game } from '@/types'
import Balance from '@/ui/components/Balance.vue'
import EditableName from '@/ui/components/EditableName.vue'
import EditableNumber from '@/ui/components/EditableNumber.vue'
import InputNewPlayer from '@/ui/components/InputNewPlayer.vue'
import { getTotalIn, getTotalOut, isNumber } from '@/utils'

const { game } = defineProps<{
  game: Game
}>()

const { t } = useI18n()
const confirmRemove = useDeleteConfirmationDialog(removePlayer)

const isAddingNewPlayer = ref(false)

const tableData = computed(() => {
  return game.players.map(player => ({
    ...player,
    balance: isNumber(player.out) ? player.out - player.in : null,
  }))
})
const totalIn = computed(() => getTotalIn(game).toString() ?? '')
const totalOut = computed(() => getTotalOut(game).toString() ?? '')

const editingValue = ref('')
function editValue(index: number, type: 'in' | 'out') {
  editingValue.value = index + type
}
function resetEditingValue() {
  editingValue.value = ''
}
function saveInValue(name: string, value: number | null) {
  setPlayerIn({ gameId: game._id!, playerName: name, inValue: value! })
}
function saveOutValue(name: string, value: number | null) {
  setPlayerOut({ gameId: game._id!, playerName: name, outValue: value })
}
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

function removePlayer(playerName: string) {
  return removePlayerMethod({ gameId: game._id, playerName })
}
</script>

<template>
  <DataTable dataKey="name" ref="data-table" :value="tableData" class="mt-4">
    <Column field="name" body-class="max-w-0 !py-0 !pl-0 min-w-32">
      <template #body="slotProps">
        <EditableName :name="slotProps.data.name" @remove="confirmRemove" />
      </template>
    </Column>
    <Column
      field="in"
      :header="t('buy_in')"
      class="w-0"
      headerClass="thead-center safari:!px-1"
      bodyClass="!text-center !pl-0 !pr-1 !py-1"
    >
      <template #body="slotProps">
        <EditableNumber
          v-if="slotProps.data.name"
          :step="game.buyIn"
          :editing="editingValue === slotProps.index + 'in'"
          :value="slotProps.data.in"
          :min="game.buyIn"
          @click="editValue(slotProps.index, 'in')"
          @request-hide="resetEditingValue"
          @input="value => saveInValue(slotProps.data.name, value)"
        />
        <span v-else>{{ slotProps.data.in }}</span>
      </template>
    </Column>
    <Column
      field="out"
      :header="t('buy_out')"
      class="w-0"
      headerClass="thead-center safari:!px-1"
      bodyClass="!text-center !pl-0 !pr-1 !py-1"
    >
      <template #body="slotProps">
        <EditableNumber
          v-if="slotProps.data.name"
          :editing="editingValue === slotProps.index + 'out'"
          :value="slotProps.data.out"
          :min="0"
          @click="editValue(slotProps.index, 'out')"
          @request-hide="resetEditingValue"
          @input="value => saveOutValue(slotProps.data.name, value)"
        />
        <span v-else>{{ slotProps.data.out }}</span>
      </template>
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
</template>

<style>
.thead-center > div {
  justify-content: center;
}
</style>
