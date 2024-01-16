import { EventsList } from '@ioc:Adonis/Core/Event'
import influx from '@ioc:Influx'

export default class Search {
  public async onSearched(data: EventsList['search:searched']) {
    await influx.writePoint('search:terms', { term: data.term }, {total: data.totalResults})
  }
}
