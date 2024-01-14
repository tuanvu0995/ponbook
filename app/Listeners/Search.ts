import { EventsList } from '@ioc:Adonis/Core/Event'
import SearchTerm from 'App/Models/SearchTerm'

export default class Search {
  public async onSearched(data: EventsList['search:searched']) {
    const existsTerm = await SearchTerm.findBy('term', data.term)
    if (existsTerm) {
      existsTerm.totalResults = data.totalResults
      existsTerm.count++
      existsTerm.lastDayCount++
      existsTerm.lastWeekCount++
      existsTerm.lastMonthCount++
      existsTerm.lastYearCount++
      await existsTerm.save()
    } else {
      await SearchTerm.create({
        term: data.term,
        totalResults: data.totalResults,
        count: 1,
        lastDayCount: 1,
        lastWeekCount: 1,
        lastMonthCount: 1,
        lastYearCount: 1,
      })
    }
  }
}
