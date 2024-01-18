import type { JobHandlerContract, Job } from '@ioc:Queue'
import Video from 'App/Models/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import MeiliSearch from '@ioc:MeiliSearch'
import Redis from '@ioc:Adonis/Addons/Redis'

const reindexJobKey = 'reindex_job_lastReindex'

type ReindexJobPayload = {
  incremental: boolean
}

export default class implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle({ incremental = true }: ReindexJobPayload) {
    Logger.info(`Start reindex job.`)

    const count = await this.count(incremental)
    Logger.info(`Start reindex for ${count[0].$extras.total} videos.`)

    const total = count[0].$extras.total
    await this.job.updateData({ total, processed: 0 })

    let currentPage = 0
    let processed = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
      Logger.info(`Start reindex for page ${currentPage + 1}`)
      const videos = await this.getVideos(currentPage + 1, incremental)
      Logger.info(`Start reindex for page ${videos.currentPage} of ${videos.lastPage}`)

      const documents = videos.all().map((video) => ({
        id: video.id,
        title: video.title,
        code: video.code,
        cast: video.casts.map((cast) => cast.name),
        tags: video.tags.map((tag) => tag.name),
        releaseDate: video.releaseDate,
        createdAt: video.createdAt.toISO(),
      }))

      if (documents.length) {
        Logger.info(`Documents length ${documents.length}`)
        await MeiliSearch.index('videos', documents)
        Logger.info(
          `Completed reindex for page ${videos.currentPage} of ${videos.lastPage}. Total ${videos.total} videos.`
        )
      }

      if (currentPage >= videos.lastPage) {
        break
      }
      currentPage = videos.currentPage

      processed += documents.length
      await this.job.updateData({ processed })
      await this.job.updateProgress(processed / total)
    }

    const lastReindex = new Date().toISOString()
    await Redis.set(reindexJobKey, lastReindex)

    Logger.info(`Completed reindex job. Exporting index.`)
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}

  private async getVideos(currentPage: number, incremental = true) {
    const query = Video.query()
      .preload('casts')
      .preload('tags')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('id', 'desc')

    if (incremental) {
      const lastReindex = await Redis.get(reindexJobKey)
      if (lastReindex) {
        query.where('updated_at', '>', lastReindex)
      }
    }

    return await query.paginate(currentPage, 100)
  }

  private async count(incremental = true) {
    const query = Video.query().where('is_published', true).where('is_deleted', false)

    if (incremental) {
      const lastReindex = await Redis.get(reindexJobKey)
      if (lastReindex) {
        query.where('updated_at', '>', lastReindex)
      }
    }

    return await query.count('id as total')
  }
}
