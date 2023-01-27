import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collection from 'App/Models/Collection'
import Post from 'App/Models/Post'
import Video from 'App/Models/Video'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    const collections = await Collection.query().where('is_deleted', false)

    for (const collection of collections) {
      await collection.load('videos', (query) =>
        query
          .where('is_published', true)
          .where('is_deleted', false)
          .orderBy('video_collections.order', 'asc')
          .limit(12)
      )
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

    const posts = await Post.query()
      .preload('user')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('updated_at', 'desc')
      .limit(6)

    return view.render('index', { collections, newlyUpdatedVideos, posts })
  }
}
