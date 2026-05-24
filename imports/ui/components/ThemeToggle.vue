<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTheme } from '@/composables/useTheme'

const { variant = 'surface' } = defineProps<{
  variant?: 'surface' | 'banner'
}>()

const { isDark, toggle } = useTheme()
const { t } = useI18n()

const label = computed(() =>
  isDark.value ? t('theme_light') : t('theme_dark')
)
</script>

<template>
  <button
    type="button"
    :class="
      variant === 'banner'
        ? `inline-flex h-[42px] w-[42px] cursor-pointer items-center
          justify-center rounded-[11px] border-none bg-white/12 text-white
          transition-colors hover:bg-white/20`
        : 'ft-icon-btn'
    "
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
  </button>
</template>
