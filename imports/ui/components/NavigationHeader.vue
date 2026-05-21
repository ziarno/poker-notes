<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  title?: string
  subtitle?: string
}>()
defineSlots<{
  icon(): any
}>()

const router = useRouter()

function checkIfWeWentBack() {
  const { currentRoute } = router
  setTimeout(() => {
    if (router.currentRoute === currentRoute) {
      router.push('/')
    }
  }, 50)
}

function goBack() {
  router.back()
  checkIfWeWentBack()
}
</script>

<template>
  <div
    class="flex gap-[10px] pt-[6px] pb-[14px]"
    :class="{ ['items-center']: !subtitle }"
  >
    <button type="button" class="ft-icon-btn" @click="goBack">
      <i class="pi pi-chevron-left"></i>
    </button>
    <div class="min-w-0 flex-1">
      <p
        v-if="title"
        class="text-ft-ink m-0 font-sans text-lg leading-[1.15] font-semibold"
      >
        {{ title }}
      </p>
      <p
        v-if="subtitle"
        class="text-ft-ink-50 mt-[2px] mb-0 font-sans text-[13px]"
      >
        {{ subtitle }}
      </p>
    </div>
    <div class="flex gap-2">
      <slot name="icon"></slot>
    </div>
  </div>
</template>
