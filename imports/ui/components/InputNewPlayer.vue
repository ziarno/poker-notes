<script setup lang="ts">
import Button from '@volt/Button.vue'
import InputText from '@volt/InputText.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { onClickOutside } from '@vueuse/core'
import { ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { NewPlayer } from '@/types'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'

const emit = defineEmits<{
  (e: 'add', player: NewPlayer): void
  (e: 'cancel'): void
}>()
const props = defineProps<{
  buyIn: number
  showCancel?: boolean
  showInput?: boolean
}>()
const { t } = useI18n()
const inputRef = useTemplateRef('name-input')
const formRef = useTemplateRef('form')

const getDefaultValue = () => ({
  name: '',
  in: props.buyIn,
})

const playerFormData = ref(getDefaultValue())

const onSubmit = () => {
  if (!playerFormData.value.name || !playerFormData.value.in) return
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

onClickOutside(formRef, () => props.showCancel && emit('cancel'))
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex space-x-3" ref="form">
    <InputText
      ref="name-input"
      class="w-0 flex-grow"
      inputId="player_name"
      v-model="playerFormData.name"
      :placeholder="t('name')"
    />
    <InputNumberStep
      v-if="showInput"
      :min="buyIn"
      :step="buyIn"
      v-model="playerFormData.in"
      @keydown.prevent.enter="onSubmit"
    />
    <Button type="submit" icon="pi pi-plus" class="shrink-0"></Button>
    <SecondaryButton
      outlined
      v-if="showCancel"
      icon="pi pi-times"
      class="shrink-0"
      @click="emit('cancel')"
    ></SecondaryButton>
  </form>
</template>
