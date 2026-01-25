<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { onClickOutside } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

import InputNumberStep from '@/ui/components/InputNumberStep.vue'

const props = defineProps<{
  value: number | null
  editing: boolean
  step?: number
  min?: number
}>()

const modelValue = ref(props.value)

const emit = defineEmits<{
  (e: 'requestHide'): void
  (e: 'input', value: number | null): void
}>()

const refInput = useTemplateRef('input')
onClickOutside(refInput, () => {
  emit('requestHide')
})
</script>

<template>
  <SecondaryButton
    outlined
    class="relative flex h-full min-h-[40px] w-full items-center justify-center overflow-visible"
  >
    <span>{{ value }}</span>
    <div
      v-if="editing"
      class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform bg-white"
    >
      <InputNumberStep
        @keydown.prevent.enter="emit('requestHide')"
        ref="input"
        :step="step"
        :min="min"
        v-model="modelValue"
        @update:model-value="emit('input', $event)"
        class="absolute"
      />
    </div>
  </SecondaryButton>
</template>
