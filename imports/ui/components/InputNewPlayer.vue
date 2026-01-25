<script setup lang="ts">
import Button from '@volt/Button.vue'
import InputText from '@volt/InputText.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { onClickOutside } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'add', name: string): void
  (e: 'cancel'): void
}>()
const props = defineProps<{
  excludeNames?: string[]
  showCancel?: boolean
}>()
const { t } = useI18n()
const inputRef = useTemplateRef('name-input')
const formRef = useTemplateRef('form')
const toast = useToast()

const name = ref('')

const onSubmit = () => {
  const isExcludedName = props.excludeNames?.includes(name.value)
  if (isExcludedName) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error_duplicate_name'),
      life: 3000,
    })
    return
  }

  if (!name.value) {
    return
  }

  emit('add', name.value)
  name.value = ''
  inputRef.value?.$el?.focus()
}

onClickOutside(formRef, () => props.showCancel && emit('cancel'))
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex space-x-3" ref="form">
    <InputText
      ref="name-input"
      class="w-0 flex-grow"
      inputId="player_name"
      v-model="name"
      :placeholder="t('name')"
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
