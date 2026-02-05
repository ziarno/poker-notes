import { MaybeRefOrGetter, computed, toValue } from 'vue'

import { Game } from '@/types'
import { getCreatorId } from '@/utils/creatorId.ts'

export function useIsGameCreator(game: MaybeRefOrGetter<Game | undefined>) {
  return computed(() => {
    const g = toValue(game)
    if (!g?.creatorId) return false
    return g.creatorId === getCreatorId()
  })
}
