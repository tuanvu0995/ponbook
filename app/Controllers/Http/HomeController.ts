import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'
import Video from 'App/Models/Video'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    const collections = await Collection.query()
      .where('is_deleted', false)
      .preload('videos', (q) => q.orderBy('video_collections.order', 'asc').limit(12))

    for (const collection of collections) {
      for (const video of collection.videos) {
        await video.preloadImages()
        await video.loadAggregate('comments', (query) => query.count('*').as('commentsCount'))
      }
    }

    const newlyUpdatedVideos = await Video.query().orderBy('updated_at', 'desc').limit(12)
    for (const video of newlyUpdatedVideos) {
      await video.preloadImages()
      await video.loadAggregate('comments', (query) => query.count('*').as('commentsCount'))
    }

    return view.render('index', { collections, newlyUpdatedVideos })
  }
}
