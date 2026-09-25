import { PlayerColor } from '@/types'

// Ordered so that the first players of a game get the most distinct hues;
// similar hues (e.g. blue/indigo/sky) are deliberately left out.
export const PLAYER_COLORS: PlayerColor[] = [
  { light: '#2563eb', dark: '#60a5fa' }, // blue
  { light: '#ea580c', dark: '#fb923c' }, // orange
  { light: '#9333ea', dark: '#c084fc' }, // purple
  { light: '#16a34a', dark: '#4ade80' }, // green
  { light: '#db2777', dark: '#f472b6' }, // pink
  { light: '#a16207', dark: '#facc15' }, // yellow
  { light: '#0d9488', dark: '#2dd4bf' }, // teal
  { light: '#dc2626', dark: '#f87171' }, // red
  { light: '#64748b', dark: '#94a3b8' }, // slate
  { light: '#78350f', dark: '#d4a373' }, // brown
]
