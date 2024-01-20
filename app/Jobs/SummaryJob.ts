import _ from 'lodash'
import { DateTime } from 'luxon'
import type { JobHandlerContract, Job } from '@ioc:Queue'
import Logger from '@ioc:Adonis/Core/Logger'
import influx from '@ioc:Influx'
import Video from 'App/Models/Video'

export default class implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle() {
    Logger.info('Summary job started')

    const queryApi = influx.getQueryApi()
    const yesterday = DateTime.now()

    let lastOffset = 0

    // get data range 1h at a day

    let offsetTime = yesterday.startOf('day')
    let stopTime = offsetTime.plus({ minutes: 10 })

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const groupByVideoIdsQuery = `
      from(bucket: "${influx.bucket}")
      |> range(start: ${offsetTime.toISO()}, stop: ${stopTime.toISO()})
      |> filter(fn: (r) => r["_measurement"] == "video:views")
      |> filter(fn: (r) => r["location"] == "${influx.location}")
      |> group(columns: ["videoId"])
      |> count(column: "_value")
    `

      const data = await queryApi.collectRows(groupByVideoIdsQuery)
      if (data.length === 0) {
        break
      }

      console.log(data[0])

      await this.updateVideosViewCount(data)

      lastOffset += data.length

      offsetTime = stopTime
      stopTime = offsetTime.plus({ minutes: 10 })

      if (offsetTime > yesterday.endOf('day')) {
        break
      }

      await this.job.updateData({ processed: lastOffset })
    }

    await this.job.updateProgress(1)

    Logger.info('Summary job completed')
  }

  private async updateVideosViewCount(data: any[]) {
    Logger.info(`Updating ${data.length} videos view count`)
    const videoIds = data.map((item: any) => item.videoId)
    const videos = await Video.query().whereIn('id', videoIds)
    const videosById = _.keyBy(videos, 'id')

    for (const item of data) {
      const video = videosById[item.videoId]
      if (video) {
        const count = item._value | 0
        video.viewCount += count
        video.viewCountDay = count
        video.viewCountWeek += count
        video.viewCountMonth += count
        await video.save()
      }
    }

    Logger.info(`Updated ${data.length} videos view count`)
  }

  public async failed() {}
}
