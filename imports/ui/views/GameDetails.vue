<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute, useRouter } from 'vue-router'

import { GamesCollection } from '@/api/collections'
import { useFormattedDate } from '@/composables'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import InfoTags from '@/ui/components/InfoTags.vue'
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
subscribe('game', id)

const game = autorun(() => GamesCollection.findOne(id)).result
const date = useFormattedDate(game.value?.date, 'dd.MM.yyyy')
const confirmRemoveGame = useDeleteConfirmationDialog(removeGame)

const tableData = computed(() => {
  if (!game.value) return []

  const playersData = game.value.players.map(player => ({
    ...player,
    balance: isNumber(player.out) ? player.out - player.in : null,
  }))
  const sums = {
    in: game.value.players.reduce((sum, p) => sum + p.in, 0),
    out: game.value.players.reduce((sum, p) => sum + (p.out || 0), 0),
  }
  return [...playersData, sums]
})
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
      class="mt-5 flex justify-around space-x-1 flex-wrap items-start"
    />
    <div class="mt-4">
      <DataTable :value="tableData">
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
          bodyClass="!text-center"
        ></Column>
        <Column
          field="out"
          :header="t('buy_out')"
          class="w-0"
          headerClass="text-center"
          bodyClass="!text-center"
        ></Column>
        <Column
          field="balance"
          :header="t('balance')"
          class="w-0"
          headerClass="text-center"
          bodyClass="!text-center"
        ></Column>
      </DataTable>
    </div>
  </template>
</template>

<style scoped></style>
