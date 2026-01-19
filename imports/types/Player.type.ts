export interface Player {
  name: string
  in: number
  out: number | null
}

export interface FinishedPlayer extends Player {
  out: number
}

export type NewPlayer = Pick<Player, 'name' | 'in'>
