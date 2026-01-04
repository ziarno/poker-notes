import { Player } from '/imports/types/Player.type.ts'
import { Transfer } from '/imports/types/Transfer.type.ts'

export interface Game {
  _id?: string
  title: string
  date: Date
  players: Player[]
  transfers: Transfer[]
}
