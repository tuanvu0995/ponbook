import Collection from 'App/Models/Collection'

export default class CollectionRepository {
  public static async getHomeCollections(): Promise<Collection[]> {
    const collections = await Collection.query().where('slug', 'popular').where('is_deleted', false)

    for (const collection of collections) {
      await collection.load('videos', (query) =>
        query
          .preload('videoCover')
          .where('is_published', true)
          .where('is_deleted', false)
          .orderBy('video_collections.order', 'asc')
          .limit(20)
      )
    }

    return collections
  }
}
