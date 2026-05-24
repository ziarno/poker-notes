import { usePreferredDark, useStorage } from '@vueuse/core'
import { computed, watch } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'theme'

const themePreferenceStored = useStorage<ThemePreference>(STORAGE_KEY, 'auto')
const systemThemeIsDark = usePreferredDark()

const isDark = computed(() =>
  themePreferenceStored.value === 'auto'
    ? systemThemeIsDark.value
    : themePreferenceStored.value === 'dark'
)

watch(
  isDark,
  dark => document?.documentElement.classList.toggle('dark', dark),
  { immediate: true }
)

export function useTheme() {
  function toggle() {
    themePreferenceStored.value = isDark.value ? 'light' : 'dark'
  }

  return { isDark, preference: themePreferenceStored, toggle }
}
