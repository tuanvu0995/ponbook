import Collection from 'App/Models/Collection'
import Redis from '@ioc:Adonis/Addons/Redis'

export default class CollectionRepository {
  public async getHomeCollections(): Promise<Collection[]> {
    const cachedCollections = await Redis.get('collections:home')
    if (cachedCollections) {
      return JSON.parse(cachedCollections)
    }

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

    await Redis.set('collections:home', JSON.stringify(collections))

    return collections
  }
}
