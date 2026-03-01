import { useStorage } from '@vueuse/core'

const STORAGE_KEY = 'accessToGameIds'

export const accessToGameIds = useStorage<string[]>(STORAGE_KEY, [])

export function addAccessToGameId(id: string): void {
  if (!accessToGameIds.value.includes(id)) {
    accessToGameIds.value.push(id)
  }
}
