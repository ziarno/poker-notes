import { Game, Transfer } from '@/types'

type GameTransfers = Pick<Game, 'transfers' | 'history'>

function isSameTransfer(a: Transfer, b: Transfer) {
  return a.from === b.from && a.to === b.to && a.value === b.value
}

// Identical transfers are interchangeable, so the last one in the list and the
// latest matching transfer_added history item are taken as the one meant.
function findTransfer(game: GameTransfers, transfer: Transfer) {
  const transferIndex = game.transfers
    .map(t => isSameTransfer(t, transfer))
    .lastIndexOf(true)

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

  return { transferIndex, historyIndex }
}

export function removeTransferFromGame(
  game: GameTransfers,
  transfer: Transfer
): GameTransfers {
  const { transferIndex, historyIndex } = findTransfer(game, transfer)
  if (transferIndex === -1) return game

  return {
    transfers: game.transfers.filter((_, index) => index !== transferIndex),
    history: game.history.filter((_, index) => index !== historyIndex),
  }
}

// Replaces the transfer and rewrites its transfer_added history item in place,
// keeping the item's original timestamp.
export function editTransferInGame(
  game: GameTransfers,
  transfer: Transfer,
  newTransfer: Transfer
): GameTransfers {
  const { transferIndex, historyIndex } = findTransfer(game, transfer)
  if (transferIndex === -1) return game

  const replacement: Transfer = {
    from: newTransfer.from,
    to: newTransfer.to,
    value: newTransfer.value,
  }
  return {
    transfers: game.transfers.map((t, index) =>
      index === transferIndex ? replacement : t
    ),
    history: game.history.map((item, index) =>
      index === historyIndex && item.type === 'transfer_added'
        ? { ...item, transfer: { ...replacement } }
        : item
    ),
  }
}
