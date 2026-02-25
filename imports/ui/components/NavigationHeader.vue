<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useRouter } from 'vue-router'

defineProps<{
  title?: string
  subtitle?: string
}>()
defineSlots<{
  icon(): any
}>()

const router = useRouter()

function goBack() {
  const { currentRoute } = router
  router.back()
  setTimeout(() => {
    // check if it worked - it's possible that we couldn't go back
    if (router.currentRoute === currentRoute) {
      router.push('/')
    }
  }, 50)
}
</script>

<template>
  <div class="mb-4 flex w-full items-center space-x-2">
    <SecondaryButton
      @click="goBack"
      icon="pi pi-chevron-left"
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
