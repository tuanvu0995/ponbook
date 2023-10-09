import _ from 'lodash'
import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'
import Logger from '@ioc:Adonis/Core/Logger'
import View from 'App/Models/View'
import { DateTime } from 'luxon'
import Video from 'App/Models/Video'

export type SummaryViewPayload = {
  startTime: DateTime
}

export default class implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle() {

    Logger.info('Job summaryViews is running')
    const time = DateTime.now()

    const startOfDay = time.startOf('day')
    const endOfDay = time.endOf('day')

    const views = await View.query()
      .where('created_at', '>=', startOfDay.toSQL())
      .where('created_at', '<=', endOfDay.toSQL())
      .where('range', 'day')

    const videoIds = views.map((view) => view.refererId)
    const uniqueVideoIds = [...new Set(videoIds)]

    const chunks = _.chunk(uniqueVideoIds, 100)
    for (const chunk of chunks) {
      const videos = await Video.query().whereIn('id', chunk)

      await Promise.all(
        videos.map(async (video) => {
          const videoViews = views.filter(
            (view) => view.refererType === 'videos' && view.refererId === video.id
          )
          video.viewCount += videoViews.reduce((acc, view) => acc + view.count, 0)
          await video.save()
        })
      )
    }

    Logger.info('Job summaryViews is finished')
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
