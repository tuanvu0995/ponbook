import type { EventsList } from '@ioc:Adonis/Core/Event'
import { Queue } from '@ioc:Rlanz/Queue'
import Logger from '@ioc:Adonis/Core/Logger'

export default class Job {
  public async summaryViews(payload: EventsList['job:summaryViews']) {
    Logger.info('Job summaryViews is dispatched')
    Queue.dispatch('App/Jobs/SummaryView', payload)
  }
}
