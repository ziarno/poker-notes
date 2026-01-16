<script setup lang="ts">
import Button from '@volt/Button.vue'
import InputText from '@volt/InputText.vue'
import { ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { NewPlayer } from '@/types'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'

const emit = defineEmits<{
  (e: 'add', player: NewPlayer): void
}>()
const props = defineProps<{
  buyIn: number
}>()
const { t } = useI18n()
const inputRef = useTemplateRef('name-input')

const getDefaultValue = () => ({
  name: '',
  in: props.buyIn,
})

const playerFormData = ref(getDefaultValue())

const onSubmit = () => {
  emit('add', { ...playerFormData.value })
  Object.assign(playerFormData.value, getDefaultValue())
  inputRef.value?.$el?.focus()
}

watch(
  () => props.buyIn,
  () => {
    playerFormData.value.in = props.buyIn
  }
)
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex space-x-3">
    <InputText
      ref="name-input"
      class="min-w-16 flex-grow"
      inputId="player_name"
      v-model="playerFormData.name"
      :placeholder="t('name')"
    />
    <InputNumberStep
      :min="buyIn"
      :step="buyIn"
      v-model="playerFormData.in"
      input-class="max-w-[45px]"
      @keydown.prevent.enter="onSubmit"
    />
    <Button type="submit" icon="pi pi-plus" class="shrink-0"></Button>
  </form>
</template>
