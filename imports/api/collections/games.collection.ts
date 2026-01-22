import { Mongo } from 'meteor/mongo'

import { Game } from '@/types/Game.type'

export const GamesCollection = new Mongo.Collection<Game>('games')

// Keep games for offline access
GamesCollection.keep({}, { limit: 100, sort: { createdAt: -1 } })
