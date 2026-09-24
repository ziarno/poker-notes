import { Game, Transfer } from '@/types'

function isSameTransfer(a: Transfer, b: Transfer) {
  return a.from === b.from && a.to === b.to && a.value === b.value
}

export function removeTransferFromGame(
  game: Pick<Game, 'transfers' | 'history'>,
  transfer: Transfer
): Pick<Game, 'transfers' | 'history'> {
  const transferIndex = game.transfers
    .map(t => isSameTransfer(t, transfer))
    .lastIndexOf(true)
  if (transferIndex === -1) return game

  let historyIndex = -1
  let latestTime = -Infinity
  game.history.forEach((item, index) => {
    if (item.type !== 'transfer_added') return
    if (!isSameTransfer(item.transfer, transfer)) return
    const time = new Date(item.timestamp).getTime()
    if (time >= latestTime) {
      historyIndex = index
      latestTime = time
    }
  })

  return {
    transfers: game.transfers.filter((_, index) => index !== transferIndex),
    history: game.history.filter((_, index) => index !== historyIndex),
  }
}
