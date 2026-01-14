import { computed } from 'vue'

import { formatDate } from '@/utils'

export function useFormattedDate(date: Date, format: string) {
  return computed(() => formatDate(date, format))
}
