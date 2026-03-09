import { MaybeRefOrGetter, computed, toValue } from 'vue'

import { formatDate } from '@/utils'

export function useFormattedDate(date: MaybeRefOrGetter<Date | undefined>, format: string) {
  return computed(() => {
    const d = toValue(date)
    return d && formatDate(d, format)
  })
}
