import { Mongo } from 'meteor/mongo'

import { Game } from '@/types/Game.type'

export const GamesCollection = new Mongo.Collection<Game>('games')
