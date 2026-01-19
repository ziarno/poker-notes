<script setup lang="ts">
import MinusIcon from '@primevue/icons/minus'
import PlusIcon from '@primevue/icons/plus'
import InputNumber from '@volt/InputNumber.vue'

defineProps<{
  inputClass?: string
  step?: number
}>()
</script>

<template>
  <InputNumber
    :min="0"
    :input-class="`text-center !pl-1 !pr-1 max-w-[45px] ${inputClass}`"
    :use-grouping="false"
    showButtons
    buttonLayout="horizontal"
    :step="step ?? 10"
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
