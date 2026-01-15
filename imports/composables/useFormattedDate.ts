import { computed } from 'vue'

import { formatDate } from '@/utils'

export function useFormattedDate(date: Date | undefined, format: string) {
  return computed(() => date && formatDate(date, format))
}
