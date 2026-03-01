import { Meteor } from 'meteor/meteor'

import { GamesCollection } from '@/api/collections/games.collection.ts'
import { Game } from '@/types/Game.type.ts'

Meteor.publish('games', function (creatorId: string, limit = 20): Mongo.Cursor<Game> {
  return GamesCollection.find({ creatorId }, { limit, sort: { date: -1 } })
})

Meteor.publish('game', function (id: string) {
  return GamesCollection.find({ _id: id })
})
