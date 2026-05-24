import { GamesCollection } from '@/api/collections'
import { HistoryItem } from '@/types'
import { generateGameId } from '@/utils/gameId.utils.ts'

const START_LENGTH = 4
const ATTEMPTS_PER_LENGTH = 8

export async function generateUniqueGameId(): Promise<string> {
  let length = START_LENGTH
  let attempts = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = generateGameId(length)
    const existing = await GamesCollection.findOneAsync(candidate, {
      fields: { _id: 1 },
    })
    if (!existing) return candidate
    if (++attempts >= ATTEMPTS_PER_LENGTH) {
      length++
      attempts = 0
    }
  }
}

export async function renamePlayerInHistoryAndTransfers(
  gameId: string,
  oldPlayerName: string,
  newPlayerName: string
) {
  function maybeRenameInTransfer(name: string) {
    return name === oldPlayerName ? newPlayerName : name
  }

  const updatedGame = await GamesCollection.findOneAsync(gameId)
  if (!updatedGame) return

  const transfers = updatedGame.transfers.map(t => ({
    ...t,
    from: maybeRenameInTransfer(t.from),
    to: maybeRenameInTransfer(t.to),
  }))

  const history = updatedGame.history.map((historyItem): HistoryItem => {
    if (
      'playerName' in historyItem &&
      historyItem.playerName === oldPlayerName
    ) {
      return { ...historyItem, playerName: newPlayerName }
    }
    if ('transfer' in historyItem) {
      return {
        ...historyItem,
        transfer: {
          ...historyItem.transfer,
          from: maybeRenameInTransfer(historyItem.transfer.from),
          to: maybeRenameInTransfer(historyItem.transfer.to),
        },
      }
    }
    return historyItem
  })

  await GamesCollection.updateAsync(gameId, {
    $set: { transfers, history },
  })
}
