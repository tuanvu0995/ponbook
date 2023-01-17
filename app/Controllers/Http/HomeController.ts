import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'

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

    return view.render('index', { collections })
  }
}
