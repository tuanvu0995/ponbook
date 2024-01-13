import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'
import Video from 'App/Models/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import MeiliSearch from '@ioc:MeiliSearch'

export default class implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle() {
    Logger.info(`Start reindex job.`)

    const count = await this.count()
    Logger.info(`Start reindex for ${count[0].$extras.total} videos.`)

    let currentPage = 0
    while (true) {
      Logger.info(`Start reindex for page ${currentPage + 1}`)
      const videos = await this.getVideos(currentPage + 1)
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
    }

    Logger.info(`Completed reindex job. Exporting index.`)
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}

  private async getVideos(currentPage: number) {
    return await Video.query()
      .preload('casts')
      .preload('tags')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('id', 'desc')
      .paginate(currentPage, 100)
  }

  private async count() {
    return await Video.query()
      .where('is_published', true)
      .where('is_deleted', false)
      .count('id as total')
  }
}
