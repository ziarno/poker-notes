<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const tabs = computed(() => [
  { path: '/', icon: 'pi pi-list', label: t('games') },
  { path: '/odds', icon: 'pi pi-calculator', label: t('odds') },
])

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/' || route.path !== '/odds'
  }
  return route.path.startsWith(path)
}

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="bg-ft-surface border-ft-ink-10 z-50 flex border-t">
    <button
      v-for="tab in tabs"
      :key="tab.path"
      class="flex flex-1 cursor-pointer flex-col items-center gap-[3px]
        border-none bg-transparent pt-[10px] pb-3 font-sans text-[13px]
        transition-colors"
      :class="
        isActive(tab.path)
          ? 'text-ft-green font-semibold'
          : 'text-ft-ink-50 font-medium'
      "
      @click="navigate(tab.path)"
    >
      <span
        class="inline-flex items-center justify-center rounded-full px-[14px]
          py-[5px]"
        :class="
          isActive(tab.path)
            ? 'bg-ft-green-soft text-ft-green'
            : 'text-ft-ink-50'
        "
      >
        <i :class="tab.icon" class="text-lg"></i>
      </span>
      <span class="text-[13px]">{{ tab.label }}</span>
    </button>
  </nav>
</template>
