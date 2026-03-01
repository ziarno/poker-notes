const CREATOR_ID_KEY = 'creatorId'

export function getCreatorId(): string {
  let id = localStorage.getItem(CREATOR_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(CREATOR_ID_KEY, id)
  }
  return id
}
