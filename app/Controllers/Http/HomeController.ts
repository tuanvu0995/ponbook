import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'
import Video from 'App/Models/Video'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    const collections = await Collection.query()
      .where('is_deleted', false)
      .preload('videos', (q) =>
        q.where('is_published', true).orderBy('video_collections.order', 'asc').limit(12)
      )

    for (const collection of collections) {
      for (const video of collection.videos) {
        await video.preloadImages()
      }
    }

    const newlyUpdatedVideos = await Video.query()
      .innerJoin('comments', 'videos.id', 'comments.video_id')
      .where('videos.is_published', true)
      .where('comments.is_blocked', false)
      .where('comments.is_draft', false)
      .where('videos.is_deleted', false)
      .select('videos.*')
      .orderBy('videos.updated_at', 'desc')
      .groupBy('videos.id')
      .limit(12)
    for (const video of newlyUpdatedVideos) {
      await video.preloadImages()
    }

    return view.render('index', { collections, newlyUpdatedVideos })
  }
}
