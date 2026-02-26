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
  <nav
    class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 z-50 flex justify-around border-t"
  >
    <button
      v-for="tab in tabs"
      :key="tab.path"
      class="flex flex-1 cursor-pointer flex-col items-center gap-1 py-3 transition-colors"
      :class="
        isActive(tab.path)
          ? 'text-bold'
          : 'text-surface-500 dark:text-surface-400'
      "
      @click="navigate(tab.path)"
    >
      <i :class="tab.icon" class="text-xl"></i>
      <span class="text-xs">{{ tab.label }}</span>
    </button>
  </nav>
</template>
