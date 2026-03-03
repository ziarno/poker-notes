import { TexasHoldem } from 'poker-odds-calc'

type WorkerInput = {
  players: string[][]
  board: string[]
  exhaustive: boolean
}

self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { players, board, exhaustive } = event.data

  try {
    const table = new TexasHoldem()
    if (exhaustive) {
      table.exhaustive()
    }
    players.forEach(hand => {
      table.addPlayer(hand as [string, string])
    })
    if (board.length > 0) {
      table.setBoard(board)
    }

    const calculated = table.calculate()
    const result = calculated.getPlayers().map(rp => ({
      wins: rp.getWinsPercentageString(),
      ties: rp.getTiesPercentageString(),
    }))

    self.postMessage(result)
  } catch {
    self.postMessage(null)
  }
}
