import { invert } from 'lodash'

import { CardSuit, CardSuitIcon } from '@/types/PlayingCards.type.ts'
import { Invert } from '@/types/Utils.type.ts'

export const PLAYING_CARDS = [
  '🂱',
  '🂲',
  '🂳',
  '🂴',
  '🂵',
  '🂶',
  '🂷',
  '🂸',
  '🂹',
  '🂺',
  '🂻',
  '🂽',
  '🂾',
  '🃁',
  '🃂',
  '🃃',
  '🃄',
  '🃅',
  '🃆',
  '🃇',
  '🃈',
  '🃉',
  '🃊',
  '🃋',
  '🃍',
  '🃎',
  '🂡',
  '🂢',
  '🂣',
  '🂤',
  '🂥',
  '🂦',
  '🂧',
  '🂨',
  '🂩',
  '🂪',
  '🂫',
  '🂭',
  '🂮',
  '🃑',
  '🃒',
  '🃓',
  '🃔',
  '🃕',
  '🃖',
  '🃗',
  '🃘',
  '🃙',
  '🃚',
  '🃛',
  '🃝',
  '🃞',
] as const

export const SUITS_ICONS: Record<CardSuit, CardSuitIcon> = {
  spades: '♠',
  hearts: '♥',
  clubs: '♣',
  diamonds: '♦',
} as const

export const SUIT_ICONS_TO_SUIT = invert(SUITS_ICONS) as Invert<
  typeof SUITS_ICONS
>
