<script setup lang="ts">
import Button from '@volt/Button.vue'
import DataTable from '@volt/DataTable.vue'
import InputText from '@volt/InputText.vue'
import Column from 'primevue/column'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { NewPlayer } from '@/types'
import InputNewPlayer from '@/ui/components/InputNewPlayer.vue'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'
import NavigationHeader from '@/ui/components/NavigationHeader.vue'

const { t } = useI18n()

const formData = ref<{
  name: string
  buyIn: number
  players: NewPlayer[]
}>({
  name: '',
  buyIn: 50,
  players: [{ name: 'Filip', in: 90 }],
})

function addPlayer(player: NewPlayer) {
  console.log('addPlayer ', player)
  formData.value.players.push(player)
}
</script>

<template>
  <NavigationHeader :title="t('new_game')" />
  <form class="space-y-3 mb-24">
    <div>
      <label for="title" class="text-gray-600 text-sm block mb-1">{{
        t('title')
      }}</label>
      <InputText id="title" fluid v-model="formData.name" />
    </div>
    <div>
      <label for="buyIn" class="text-gray-600 text-sm block mb-1">{{
        t('buy_in')
      }}</label>
      <InputNumberStep v-model="formData.buyIn" fluid />
    </div>
    <div>
      <DataTable :value="formData.players">
        <Column field="name" :header="t('players')"></Column>
        <Column
          field="in"
          :header="t('buy_in')"
          class="w-0"
          headerClass="text-center"
          bodyClass="!text-center"
        ></Column>
      </DataTable>
      <InputNewPlayer class="mt-5" @add="addPlayer" />
    </div>
  </form>
  <div
    class="absolute bottom-0 left-0 right-0 flex justify-center mb-10 pointer-events-none"
  >
    <Button
      raised
      class="text-white pointer-events-auto"
      @click="$router.push('/new')"
      icon="pi pi-arrow-right"
      icon-pos="right"
      :label="t('create_game')"
    />
  </div>
</template>

<style scoped></style>
