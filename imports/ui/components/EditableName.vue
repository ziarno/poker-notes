<script setup lang="ts">
import InputText from '@volt/InputText.vue'
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
const formRef = useTemplateRef('formRef')

function onSubmit() {
  emit('update', name)
  isEditing.value = false
}

onClickOutside(formRef, () => {
  if (isEditing.value) {
    emit('update', formValue.value)
    isEditing.value = false
  }
})
</script>

<template>
  <form
    ref="formRef"
    @submit.prevent="onSubmit"
    class="overflow-hidden text-ellipsis"
  >
    <SecondaryButton
      v-if="isEditing"
      icon="pi pi-times"
      @click="emit('remove', name)"
      outlined
      class="mr-2 pl-0"
    />
    <span v-else class="ml-4 whitespace-nowrap">{{ name }}</span>

    <!--    <InputText-->
    <!--      v-else-->
    <!--      v-model="formValue"-->
    <!--      @keydown.prevent.enter="onSubmit"-->
    <!--      class="w-full p-0"-->
    <!--    />-->
  </form>
</template>
