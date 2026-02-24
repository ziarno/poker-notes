<script setup lang="ts">
import Button from '@volt/Button.vue'
import InputText from '@volt/InputText.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { onClickOutside } from '@vueuse/core'
import { ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCheckExcludedName } from '@/composables'
import { NewPlayer } from '@/types'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'

const emit = defineEmits<{
  (e: 'add', player: NewPlayer): void
  (e: 'cancel'): void
}>()
const props = defineProps<{
  excludeNames?: string[]
  buyIn: number
  showCancel?: boolean
  showBuyIn?: boolean
}>()
const { t } = useI18n()
const inputRef = useTemplateRef('name-input')
const formRef = useTemplateRef('form')
const checkIsNameExcluded = useCheckExcludedName(() => props.excludeNames)

const getDefaultValue = () => ({
  name: '',
  in: props.buyIn,
})

const playerFormData = ref(getDefaultValue())

const onSubmit = () => {
  debugger
  if (checkIsNameExcluded(playerFormData.value.name)) {
    return
  }

  emit('add', { ...playerFormData.value })
  Object.assign(playerFormData.value, getDefaultValue())
  inputRef.value?.$el?.focus()
}

onClickOutside(formRef, () => props.showCancel && emit('cancel'))

watch(
  () => props.buyIn,
  () => {
    playerFormData.value.in = props.buyIn
  }
)
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex space-x-3" ref="form">
    <InputText
      ref="name-input"
      class="w-0 flex-grow"
      inputId="player_name"
      v-model.trim="playerFormData.name"
      :placeholder="t('name')"
    />
    <InputNumberStep
      v-if="showBuyIn"
      :min="buyIn"
      :step="buyIn"
      v-model="playerFormData.in"
      @keydown.prevent.enter="onSubmit"
    />
    <SecondaryButton
      outlined
      v-if="showCancel"
      icon="pi pi-times"
      class="shrink-0"
      @click="emit('cancel')"
    />
    <Button type="submit" icon="pi pi-check" class="shrink-0" />
  </form>
</template>
