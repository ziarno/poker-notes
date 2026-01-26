<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { onClickOutside } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

const { name } = defineProps<{
  name: string
}>()
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'remove', value: string): void
}>()
const isEditing = ref(false)
const formValue = ref(name)
const formRef = useTemplateRef('form')

function onSubmit() {
  emit('update', name)
  isEditing.value = false
}

onClickOutside(formRef, () => {
  if (isEditing.value) {
    emit('update:name')
    isEditing.value = false
  }
})
</script>

<template>
  <form ref="formRef" @submit.prevent="onSubmit">
    <SecondaryButton
      icon="pi pi-times"
      @click="emit('remove', name)"
      outlined
      class="mr-2 pl-0"
    />
    <span v-if="!isEditing">{{ name }}</span>
    <InputText v-model="formValue" @keydown.prevent.enter="onSubmit" />
  </form>
</template>
