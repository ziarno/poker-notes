<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'

defineProps<{
  title?: string
  subtitle?: string
}>()
defineSlots<{
  icon(): any
}>()
</script>

<template>
  <div class="flex w-full items-center mb-4 space-x-2">
    <SecondaryButton
      @click="$router.back()"
      icon="pi pi-chevron-left"
      aria-label="Bookmark"
      variant="text"
      rounded
    />
    <div class="flex-grow">
      <p class="text-lg">{{ title }}</p>
      <p v-if="subtitle" class="text-xs opacity-50">{{ subtitle }}</p>
    </div>
    <div>
      <slot name="icon"></slot>
    </div>
  </div>
</template>
