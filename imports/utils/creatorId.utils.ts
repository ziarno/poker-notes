import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'

const CREATOR_ID_KEY = 'creatorId'

// In development everyone shares this creatorId so seeded games (see the
// seed-games skill) show up without per-browser setup. Production keeps the
// real per-browser id.
export const DEV_CREATOR_ID = 'creator-id-dev'

export function getCreatorId(): string {
  if (Meteor.isDevelopment) return DEV_CREATOR_ID

  let id = localStorage.getItem(CREATOR_ID_KEY)
  if (!id) {
    id = Random.id()
    localStorage.setItem(CREATOR_ID_KEY, id)
  }
  return id
}
