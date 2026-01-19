<script setup lang="ts">
import Button from '@volt/Button.vue'
import Select from '@volt/Select.vue'
import { computed, ref } from 'vue'

import { Game, Transfer } from '@/types'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'

const { game } = defineProps<{
  game: Game
}>()

const emit = defineEmits<{
  (e: 'add', transfer: Transfer): void
  (e: 'cancel'): void
}>()

const getDefaultValue = () => ({
  from: '',
  to: '',
  value: game.buyIn,
})

const formData = ref(getDefaultValue())
const optionsFrom = computed(() =>
  game.players.map(p => p.name).filter(p => p !== formData.value.to)
)
const optionsTo = computed(() =>
  game.players.map(p => p.name).filter(p => p !== formData.value.from)
)

const onSubmit = () => {
  if (!formData.value.to || !formData.value.from || !formData.value.value) {
    return
  }
  emit('add', { ...formData.value })
  Object.assign(formData.value, getDefaultValue())
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="flex w-full justify-between space-x-3"
  >
    <Select
      a
      v-model="formData.from"
      :options="optionsFrom"
      class="shrink-1 grow-1 basis-0 overflow-hidden"
    />
    <Select
      a
      v-model="formData.to"
      :options="optionsTo"
      class="shrink-1 grow-1 basis-0 overflow-hidden"
    />
    <InputNumberStep v-model="formData.value" />
    <Button class="ml-2" @click="onSubmit" icon="pi pi-check" />
  </form>
</template>
