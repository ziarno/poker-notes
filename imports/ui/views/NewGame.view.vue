<script setup lang="ts">
import DataTable from '@volt/DataTable.vue'
import InputText from '@volt/InputText.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Column from 'primevue/column'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { createGame } from '@/api/methods/games.methods'
import { NewPlayer } from '@/types'
import InputNewPlayer from '@/ui/components/InputNewPlayer.vue'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'
import NavigationHeader from '@/ui/components/NavigationHeader.vue'

const { t } = useI18n()
const router = useRouter()

const formData = ref<{
  title: string
  buyIn: number
  players: NewPlayer[]
}>({
  title: '',
  buyIn: 50,
  players: [],
})

function addPlayer(player: NewPlayer) {
  formData.value.players.push(player)
}
function removePlayer(index: number) {
  formData.value.players.splice(index, 1)
}

async function onSubmit() {
  const id = await createGame(formData.value)
  router.replace(`/games/${id}`)
}
</script>

<template>
  <NavigationHeader :title="t('new_game')" />
  <form class="mb-14 space-y-3" @submit.prevent="onSubmit">
    <div>
      <label for="title" class="mb-1 block text-sm text-gray-600">{{
        t('title')
      }}</label>
      <InputText id="title" fluid v-model="formData.title" />
    </div>
    <div>
      <label for="buyIn" class="mb-1 block text-sm text-gray-600">{{
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
        <Column class="capitalize" field="name" :header="t('players')"></Column>
        <Column :header="t('buy_in')" class="w-0">
          <template #body="slotProps">
            <InputNumberStep
              :step="formData.buyIn"
              :min="formData.buyIn"
              v-model="slotProps.data.in"
              size="small"
            />
          </template>
        </Column>
        <Column class="w-0 !p-0">
          <template #body="slotProps">
            <SecondaryButton
              @click="removePlayer(slotProps.index)"
              variant="outlined"
              icon="pi pi-times"
            />
          </template>
        </Column>
      </DataTable>
      <InputNewPlayer :buyIn="formData.buyIn" class="mt-5" @add="addPlayer" />
      <div class="mt-8 flex justify-center">
        <SecondaryButton
          type="submit"
          raised
          icon="pi pi-arrow-right"
          icon-pos="right"
          :label="t('create_game')"
        />
      </div>
    </div>
  </form>
</template>
