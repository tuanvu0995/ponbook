import _ from 'lodash'
import { DateTime } from 'luxon'
import Logger from '@ioc:Adonis/Core/Logger'
import Video from 'App/Models/Video'
import View from 'App/Models/View'

export default class Task {
  public async summaryViews() {
    Logger.info('Tasks summaryViews is running')
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
}
