import _ from 'lodash'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Collection from 'App/Models/Collection'

export default class PBCollectionRepository {
  public static async getCollection(slug: string, limit = 1): Promise<any> {
    const collection = await Collection.query()
      .where('slug', slug)
      .where('is_deleted', false)
      .preload('videos', (query) =>
        query
          .preload('videoCover')
          .where('is_published', true)
          .where('is_deleted', false)
          .orderBy('video_collections.order', 'asc')
          .limit(limit)
      )
      .first()
    if (_.isNil(collection)) throw new NotFoundException(`Collection with slug ${slug} not found`)

    return collection
  }
}
