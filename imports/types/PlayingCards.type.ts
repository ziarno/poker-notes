import { FirstLetter } from '@/types/Utils.type.ts'

export type CardSuitIcon = '♠' | '♥' | '♣' | '♦'
export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type CardSuitShort = FirstLetter<CardSuit>

export type CardRank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'T'
  | 'J'
  | 'Q'
  | 'K'

export type Card = {
  suit: CardSuit
  rank: CardRank
}

export type CardShort = {
  suit: CardSuitShort
  rank: CardRank
}
