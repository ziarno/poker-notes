import { MaybeRefOrGetter, computed, toValue } from 'vue'

import { Game } from '@/types'
import { getCreatorId, hasValidPinCode } from '@/utils'

export function useIsGameEditor(game: MaybeRefOrGetter<Game | undefined>) {
  return computed(() => {
    const g = toValue(game)
    if (!g?._id || !g?.pinCode) return false
    return hasValidPinCode(g._id, g.pinCode) || g.creatorId === getCreatorId()
  })
}
