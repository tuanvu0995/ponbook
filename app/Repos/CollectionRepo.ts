import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Collection from 'App/Models/Collection'
import Video from 'App/Models/Video'

export default class CollectionRepo {
  public static async getVideosByCollectionSlug(
    slug: string,
    page = 1,
    limit = 10
  ): Promise<ModelPaginatorContract<Video> | null> {
    const collection = await Collection.query().where('slug', slug).first()
    if (!collection) return null

    return await collection
      ?.related('videos')
      .query()
      .preload('cover')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('video_collections.order', 'asc')
      .paginate(page, limit)
  }
}
