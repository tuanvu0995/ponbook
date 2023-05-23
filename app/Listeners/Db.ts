import type { EventsList } from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'

export default class Db {
  public async onDbQuery(query: EventsList['db:query']) {
    if (Application.inProduction) {
      Logger.debug(JSON.stringify(query, null, 2))
    } else {
      Database.prettyPrint(query)
    }
  }
}
