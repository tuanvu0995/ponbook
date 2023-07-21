import Collection from 'App/Models/Collection'

export default class CollectionRepo {
  public static async getVideosByCollectionSlug(slug: string, page = 1, limit = 10) {
    const collection = await Collection.query().where('slug', slug).first()

    return await collection
      ?.related('videos')
      .query()
      .preload('videoCover')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('video_collections.order', 'asc')
      .paginate(page, limit)
  }
}
