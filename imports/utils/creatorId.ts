import Cookies from 'js-cookie'
import { Random } from 'meteor/random'

const COOKIE_NAME = 'creatorId'
const EXPIRY_DAYS = 10 * 365 // ~10 years

export function getCreatorId(): string {
  let id = Cookies.get(COOKIE_NAME)
  if (!id) {
    id = Random.id()
    Cookies.set(COOKIE_NAME, id, { expires: EXPIRY_DAYS, sameSite: 'Lax' })
  }
  return id
}
