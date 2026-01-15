<script setup lang="ts">
import Button from '@volt/Button.vue'
import InputText from '@volt/InputText.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { NewPlayer } from '@/types'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'

const emit = defineEmits<{
  (e: 'add', player: NewPlayer): void
}>()
const { t } = useI18n()

const getDefaultValue = () => ({
  name: '',
  in: 50,
})

const playerFormData = ref(getDefaultValue())

const onSubmit = () => {
  emit('add', { ...playerFormData.value })
  Object.assign(playerFormData.value, getDefaultValue())
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex space-x-1">
    <InputText
      class="min-w-16 flex-grow"
      inputId="player_name"
      v-model="playerFormData.name"
      :placeholder="t('name')"
    />
    <InputNumberStep v-model="playerFormData.in" input-class="max-w-[60px]" />
    <Button
      type="submit"
      icon="pi pi-plus"
      icon-pos="right"
      class="shrink-0"
    ></Button>
  </form>
</template>
