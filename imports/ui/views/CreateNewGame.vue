<script setup lang="ts">
import Button from '@volt/Button.vue'
import DangerButton from '@volt/DangerButton.vue'
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
  players: [],
})

function addPlayer(player: NewPlayer) {
  console.log('addPlayer ', player)
  formData.value.players.push(player)
}
function removePlayer(index: number) {
  formData.value.players.splice(index, 1)
}

function onSubmit() {
  console.log(formData.value)
}
</script>

<template>
  <NavigationHeader :title="t('new_game')" />
  <form class="space-y-3 mb-24" @submit.prevent="onSubmit">
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
      <DataTable v-if="formData.players.length" :value="formData.players">
        <Column class="w-0">
          <template #body="slotProps">
            <span>{{ slotProps.index + 1 }}.</span>
          </template>
        </Column>
        <Column field="name" :header="t('players')"></Column>
        <Column :header="t('buy_in')" class="w-0">
          <template #body="slotProps">
            <InputNumberStep
              :step="formData.buyIn"
              :min="formData.buyIn"
              v-model="slotProps.data.in"
              input-class="max-w-[45px]"
              size="small"
            />
          </template>
        </Column>
        <Column class="w-0 !p-0">
          <template #body="slotProps">
            <DangerButton
              @click="removePlayer(slotProps.index)"
              variant="outlined"
              icon="pi pi-times"
              severity="danger"
            />
          </template>
        </Column>
      </DataTable>
      <InputNewPlayer :buyIn="formData.buyIn" class="mt-5" @add="addPlayer" />
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 flex justify-center mb-10 pointer-events-none"
    >
      <Button
        type="submit"
        raised
        class="text-white pointer-events-auto"
        @click="$router.push('/new')"
        icon="pi pi-arrow-right"
        icon-pos="right"
        :label="t('create_game')"
      />
    </div>
  </form>
</template>
