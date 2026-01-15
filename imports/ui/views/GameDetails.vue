<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute } from 'vue-router'

import { GamesCollection } from '@/api/collections'
import { useFormattedDate } from '@/composables'
import InfoTags from '@/ui/components/InfoTags.vue'
import { isNumber } from '@/utils/number.utils.ts'

const route = useRoute()
const { t } = useI18n()
const id = route.params.id
subscribe('game', id)

const game = autorun(() => GamesCollection.findOne(id)).result
const date = useFormattedDate(game.value?.date, 'dd.MM.yyyy')

const tableData = computed(() => {
  if (!game.value) return []

  const playersData = game.value.players.map(player => ({
    ...player,
    balance: isNumber(player.out) ? player.out - player.in : null,
  }))
  const sums = {
    in: game.value.players.reduce((sum, p) => sum + p.in, 0),
    out: game.value.players.reduce((sum, p) => sum + p.out, 0),
  }
  return [...playersData, sums]
})
</script>

<template>
  <div class="flex w-full items-center mb-4">
    <SecondaryButton
      @click="$router.back()"
      icon="pi pi-chevron-left"
      aria-label="Bookmark"
      variant="text"
      rounded
    />
    <div class="ml-2">
      <p class="text-lg">{{ game?.title }}</p>
      <p class="text-xs opacity-50">{{ date }}</p>
    </div>
  </div>
  <template v-if="game">
    <InfoTags
      :game="game"
      long
      class="flex justify-around space-x-1 flex-wrap space-y-2 items-start"
    />
    <div class="mt-5">
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
