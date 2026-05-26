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

// Keep the browser status-bar / address-bar color (the `theme-color` meta,
// created pre-paint in client/main.html) matched to the page background so it
// blends into the app chrome on mobile and installed PWAs. Reading the live
// --color-ft-bg token means this never drifts from the CSS palette.
function syncThemeColorMeta() {
  if (typeof document === 'undefined') return
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-ft-bg')
    .trim()
  if (bg) meta.content = bg
}

watch(
  isDark,
  dark => {
    document?.documentElement.classList.toggle('dark', dark)
    syncThemeColorMeta()
  },
  { immediate: true }
)

export function useTheme() {
  function toggle() {
    themePreferenceStored.value = isDark.value ? 'light' : 'dark'
  }

  return { isDark, preference: themePreferenceStored, toggle }
}
