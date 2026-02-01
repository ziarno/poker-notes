import { useToast } from 'primevue/usetoast'
import { type MaybeRefOrGetter, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCheckExcludedName(
  excludeNames: MaybeRefOrGetter<string[] | undefined>
) {
  const toast = useToast()
  const { t } = useI18n()
  return function isNameExcluded(name: string) {
    const isExcludedName = toValue(excludeNames)?.includes(name)
    if (!name) {
      return true
    }
    if (isExcludedName) {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('error_duplicate_name'),
        life: 3000,
      })
      return true
    }
    return false
  }
}
