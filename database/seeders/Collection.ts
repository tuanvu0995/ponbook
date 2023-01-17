import _ from 'lodash'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Collection from 'App/Models/Collection'
import Video from 'App/Models/Video'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    const existsCollections = await Collection.all()
    if (!existsCollections.length) {
      const collections = [
        { name: 'Popular', slug: 'popular' },
        { name: 'Trending', slug: 'trending' },
      ]

      await Collection.createMany(collections)
    }

    for (const collection of existsCollections) {
      const videos = await Video.query().where('is_published', true).limit(210).select('id')

      const videoIds = _.shuffle(videos.map((video) => video.id))

      const syncData = videoIds.map((id, index) => ({
        [id]: { order: index + 1 },
      }))
      const syncDataObject = Object.assign({}, ...syncData)

      await collection.related('videos').sync(syncDataObject)
    }
  }
}
