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
  <div class="mb-4 flex w-full items-center space-x-2">
    <SecondaryButton
      @click="$router.back()"
      icon="pi pi-chevron-left"
      aria-label="Bookmark"
      variant="text"
      rounded
    />
    <div class="flex-grow">
      <p class="dark:text-surface-0 text-lg">{{ title }}</p>
      <p v-if="subtitle" class="dark:text-surface-0 text-xs opacity-50">
        {{ subtitle }}
      </p>
    </div>
    <div>
      <slot name="icon"></slot>
    </div>
  </div>
</template>
