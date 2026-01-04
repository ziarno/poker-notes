import { Mongo } from 'meteor/mongo'
import { Game } from '/imports/types/Game.type'

export const GamesCollection = new Mongo.Collection<Game>('games')
