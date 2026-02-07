import { GamesCollection } from '@/api/collections'
import { HistoryItem } from '@/types'

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
