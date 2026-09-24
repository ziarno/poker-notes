import { Player } from '@/types/Player.type.ts'

// A correction applied on top of a player's raw `out` value, used to resolve a
// mismatch between the in and out totals without touching the entered values.
export interface Adjustment {
  name: Player['name']
  delta: number
}
