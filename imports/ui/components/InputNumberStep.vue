<script setup lang="ts">
import MinusIcon from '@primevue/icons/minus'
import PlusIcon from '@primevue/icons/plus'
import InputNumber from '@volt/InputNumber.vue'

defineProps<{
  inputClass?: string
}>()
</script>

<template>
  <InputNumber
    :min="0"
    :input-class="`text-center !pl-1 !pr-1 ${inputClass}`"
    :use-grouping="false"
    showButtons
    buttonLayout="horizontal"
    :step="10"
    variant="filled"
  >
    <template #incrementicon>
      <PlusIcon />
    </template>
    <template #decrementicon>
      <MinusIcon />
    </template>
  </InputNumber>
</template>
