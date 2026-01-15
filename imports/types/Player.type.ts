export interface Player {
  name: string
  in: number
  out: number
}

export type NewPlayer = Pick<Player, 'name' | 'in'>
