<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import { computed } from 'vue'
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute } from 'vue-router'

import { GamesCollection } from '@/api/collections'
import InfoTags from '@/ui/components/InfoTags.vue'

const route = useRoute()
const id = route.params.id
subscribe('game', id)

const game = autorun(() => GamesCollection.findOne(id)).result
const tableData = computed(() =>
  game.value?.players.map(player => ({
    ...player,
    balance: player.out ? player.out - player.in : null,
  }))
)
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
    <p>{{ game?.title }}</p>
  </div>
  <template v-if="game">
    <InfoTags :game="game" long class="flex justify-between space-x-1" />
    <div class="mt-5">
      <DataTable :value="tableData">
        <Column field="name" :header="$t('players')"></Column>
        <Column
          field="in"
          :header="$t('buy_in')"
          class="w-0"
          headerClass="text-center"
          bodyClass="!text-center"
        ></Column>
        <Column
          field="out"
          :header="$t('buy_out')"
          class="w-0"
          headerClass="text-center"
          bodyClass="!text-center"
        ></Column>
        <Column
          field="balance"
          :header="$t('balance')"
          class="w-0"
          headerClass="text-center"
          bodyClass="!text-center"
        ></Column>
      </DataTable>
    </div>
  </template>
</template>

<style scoped></style>
