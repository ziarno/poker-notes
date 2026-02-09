import { MaybeRefOrGetter, computed, toValue } from 'vue'

import { Game } from '@/types'
import { hasValidPinCode } from '@/utils/pinCode.utils.ts'

export function useIsGameCreator(game: MaybeRefOrGetter<Game | undefined>) {
  return computed(() => {
    const g = toValue(game)
    if (!g?._id || !g?.pinCode) return false
    return hasValidPinCode(g._id, g.pinCode)
  })
}
