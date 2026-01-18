<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute, useRouter } from 'vue-router'

import { GamesCollection } from '@/api/collections'
import { useFormattedDate } from '@/composables'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import { NewPlayer } from '@/types'
import EditableNumber from '@/ui/components/EditableNumber.vue'
import InfoTags from '@/ui/components/InfoTags.vue'
import InputNewPlayer from '@/ui/components/InputNewPlayer.vue'
import NavigationHeader from '@/ui/components/NavigationHeader.vue'
import { isNumber } from '@/utils/number.utils.ts'

const route = useRoute()
const router = useRouter()

async function removeGame() {
  await Meteor.callAsync('removeGame', game.value?._id)
  router.replace('/')
}

const { t } = useI18n()
const id = route.params.id
const isAddingNewPlayer = ref(false)
subscribe('game', id)

const game = autorun(() => GamesCollection.findOne(id)).result
const date = useFormattedDate(game.value?.date, 'dd.MM.yyyy')
const confirmRemoveGame = useDeleteConfirmationDialog(removeGame)

const tableData = computed(() => {
  return game.value?.players.map(player => ({
    ...player,
    balance: isNumber(player.out) ? player.out - player.in : null,
  }))
})
const totalIn = computed(
  () => game.value?.players.reduce((sum, p) => sum + p.in, 0).toString() ?? ''
)
const totalOut = computed(
  () =>
    game.value?.players.reduce((sum, p) => sum + (p.out || 0), 0).toString() ??
    ''
)

const editingValue = ref('')
function editValue(index: number, type: 'in' | 'out') {
  editingValue.value = index + type
}
function resetEditingValue() {
  editingValue.value = ''
}
function saveInValue(name: string, value: number | null) {
  Meteor.callAsync('setPlayerIn', game.value!._id, name, value)
}
function saveOutValue(name: string, value: number | null) {
  Meteor.callAsync('setPlayerOut', game.value!._id, name, value)
}
function addPlayer(player: NewPlayer) {
  Meteor.callAsync('addPlayer', game.value!._id, player)
  isAddingNewPlayer.value = false
}
</script>

<template>
  <NavigationHeader :title="game?.title" :subtitle="date">
    <template #icon>
      <SecondaryButton
        @click="confirmRemoveGame"
        variant="outlined"
        icon="pi pi-trash"
        severity="danger"
      />
    </template>
  </NavigationHeader>
  <template v-if="game">
    <InfoTags
      :game="game"
      long
      class="mt-5 flex flex-wrap items-start justify-around space-x-1"
    />
    <div class="mt-4">
      <DataTable ref="data-table" :value="tableData">
        <Column field="name">
          <template #body="slotProps">
            <p
              :class="{
                'text-right': !slotProps.data.name,
                'font-bold': !slotProps.data.name,
              }"
            >
              {{ slotProps.data.name || `${t('sum')}` }}
            </p>
          </template>
        </Column>
        <Column
          field="in"
          :header="t('buy_in')"
          class="w-0"
          headerClass="text-center"
          bodyClass="!text-center !p-0"
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
          headerClass="text-center"
          bodyClass="!text-center !p-0"
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
          class="w-0 !pt-0 !pb-0"
          headerClass="text-center"
          bodyClass="!text-center"
        ></Column>
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
                  :buy-in="game.buyIn"
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
    </div>
  </template>
</template>

<style>
.game-details-footer-row > span {
  font-weight: normal !important;
}
</style>
