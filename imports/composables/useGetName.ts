import { useI18n } from 'vue-i18n'

import { POT_KEY_NAME } from '@/constants'

export function useGetName() {
  const { t } = useI18n()

  return function name(n: string) {
    return n === POT_KEY_NAME ? t('pot').toUpperCase() : n
  }
}
