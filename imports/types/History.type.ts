import { Transfer } from '@/types/Transfer.type.ts'

export interface HistoryItemTransfer {
  type: 'transfer_added' | 'transfer_removed'
  timestamp: Date
  transfer: Transfer
}

export interface HistoryItemPlayerAddRemove {
  type: 'player_added' | 'player_removed'
  timestamp: Date
  playerName: string
}

export interface HistoryItemPlayerIn {
  type: 'player_in_changed'
  timestamp: Date
  playerName: string
  oldValue: number | null
  newValue: number | null
}
export interface HistoryItemPlayerOut {
  type: 'player_out_changed'
  timestamp: Date
  playerName: string
  newValue: number | null
  balance: number | null
}

export type HistoryItem =
  | HistoryItemTransfer
  | HistoryItemPlayerAddRemove
  | HistoryItemPlayerIn
  | HistoryItemPlayerOut
