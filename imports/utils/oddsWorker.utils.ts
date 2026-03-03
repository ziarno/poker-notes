import { PlayerOdds } from '@/types/PlayingCards.type.ts'

let currentRequestId = 0

export function calculateOddsAsync(data: {
  players: string[][]
  board: string[]
  exhaustive: boolean
}): Promise<PlayerOdds[] | null> {
  const currentId = ++currentRequestId
  const worker = new Worker(
    new URL('../workers/oddsWorker.ts', import.meta.url),
    { type: 'module' }
  )

  worker.postMessage(data)

  return new Promise(resolve => {
    worker.onmessage = (event: MessageEvent<PlayerOdds[] | null>) => {
      if (currentId === currentRequestId) resolve(event.data)
    }
  })
}
