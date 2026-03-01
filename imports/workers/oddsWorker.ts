import { TexasHoldem } from 'poker-odds-calc'

type WorkerInput = {
  requestId: number
  players: string[][]
  board: string[]
  exhaustive: boolean
}

type PlayerResult = {
  wins: string
  ties: string
}

type WorkerOutput = {
  requestId: number
  result: PlayerResult[] | null
}

self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { requestId, players, board, exhaustive } = event.data

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

    self.postMessage({ requestId, result } satisfies WorkerOutput)
  } catch {
    self.postMessage({ requestId, result: null } satisfies WorkerOutput)
  }
}
