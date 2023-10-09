import Logger from '@ioc:Adonis/Core/Logger'
import Video from 'App/Models/Video'
import MeiliSearch from '@ioc:MeiliSearch'

export default class Search {
  public async indexing() {
    // Implement your own logic here
    Logger.info('Indexing videos...')
    await this.indexVideos()
    Logger.info('Indexing videos completed')
  }

  private async indexVideos() {
    try {
      // Implement your own logic here
      let lastVideoId = 0

      while (true) {
        const videos = await Video.query()
          .preload('casts')
          .preload('tags')
          .preload('cover')
          .preload('director')
          .preload('maker')
          .where('id', '>', lastVideoId)
          .limit(1000)

        if (videos.length === 0) break

        Logger.info(`Indexing ${videos.length} videos`)

        const documents = videos.map((video) => ({
          id: video.id,
          uid: video.uid,
          title: video.title?.toLowerCase(),
          slug: video.slug?.toLowerCase(),
          code: video.code,
          cast: video.casts.map((cast) => cast.name?.toLowerCase()),
          tag: video.tags.map((tag) => tag.name?.toLowerCase()),
          cover: {
            data: video.cover?.data,
            path: video.cover?.path,
          },
          director: video.director?.name?.toLowerCase(),
          maker: video.maker?.name?.toLowerCase(),
        }))

        await MeiliSearch.index('videos', documents)
        lastVideoId = videos[videos.length - 1].id

        Logger.info(`Indexing videos from ${lastVideoId} to ${lastVideoId + 1000}`)
      }

      Logger.info('Indexing videos completed')
    } catch (error) {
      Logger.error("Couldn't index videos", error)
    }
  }
}
