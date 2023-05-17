import _ from 'lodash'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Collection from 'App/Models/Collection'

export default class PBCollectionRepository {
  public static async getCollection(slug: string, limit = 1): Promise<Collection> {
    const collection = await Collection.query()
      .where('slug', slug)
      .where('is_deleted', false)
      .first()
    if (_.isNil(collection)) throw new NotFoundException(`Collection with slug ${slug} not found`)

    await collection.load('videos', (query) => {
      query.preload('cover')
      query.where('is_published', true)
      query.where('is_deleted', false)
      query.orderBy('video_collections.order', 'asc')
      query.limit(limit)
    })

    return collection
  }
}
