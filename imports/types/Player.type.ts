export interface Player {
  name: string
  in: number
  out: number | null
}

export type NewPlayer = Pick<Player, 'name' | 'in'>
