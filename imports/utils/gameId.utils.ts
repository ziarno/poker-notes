import { Random } from 'meteor/random'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

export const OFFLINE_GAME_ID_LENGTH = 8

export function generateGameId(length: number): string {
  let id = ''
  for (let i = 0; i < length; i++) {
    id += ALPHABET[Math.floor(Random.fraction() * ALPHABET.length)]
  }
  return id
}
