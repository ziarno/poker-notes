import { Meteor } from 'meteor/meteor'
import { Game } from '@/types/Game.type.ts'
import { GamesCollection } from '@/api/collections/games.collection.ts'

Meteor.publish('games', function (limit = 20): Mongo.Cursor<Game> {
  return GamesCollection.find({}, { limit })
})
