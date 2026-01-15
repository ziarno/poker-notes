import { NewPlayer, Player } from '@/types/Player.type.ts'
import { Transfer } from '@/types/Transfer.type.ts'

export interface Game {
  _id?: string
  buyIn: number
  title: string
  date: Date
  players: Player[]
  transfers: Transfer[]
}

export interface NewGame {
  buyIn: Game['buyIn']
  title: Game['title']
  players: NewPlayer[]
}
