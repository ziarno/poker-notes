import { Player } from '@/types/Player.type.ts'

export interface Transfer {
  from: Player['name']
  to: Player['name']
  amount: number
}
