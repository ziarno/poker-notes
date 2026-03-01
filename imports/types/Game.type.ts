import { HistoryItem } from '@/types/History.type.ts'
import { FinishedPlayer, NewPlayer, Player } from '@/types/Player.type.ts'
import { Transfer } from '@/types/Transfer.type.ts'

export interface Game {
  _id?: string
  creatorId: string
  pinCode: string
  buyIn: number
  title: string
  date: Date
  players: Player[]
  transfers: Transfer[]
  history: HistoryItem[]
}

export interface NewGame {
  _id?: string
  creatorId: string
  pinCode: string
  buyIn: Game['buyIn']
  title: Game['title']
  players: NewPlayer[]
}

export interface FinishedGame extends Game {
  players: FinishedPlayer[]
}
