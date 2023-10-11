import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Collection from 'App/Models/Collection'
import Video from 'App/Models/Video'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'

export default class CollectionRepo {
  public static async getCollectionBySlug(slug: string): Promise<Collection> {
    const collection = await Collection.query().where('slug', slug).first()
    if (!collection) {
      throw new NotFoundException('Collection not found')
    }
    return collection
  }

  public static async getVideosByCollectionSlug(
    slug: string,
    page = 1,
    limit = 10
  ): Promise<ModelPaginatorContract<Video> | null> {
    const collection = await this.getCollectionBySlug(slug)

    return await collection
      .related('videos')
      .query()
      .preload('cover')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)
  }

  public static async calculationNewRelease(): Promise<void> {
    Logger.info('Start calculationNewRelease')
    const newReleaseCollection = await this.getCollectionBySlug('new-released')
    const now = DateTime.now().toFormat('yyyy-MM-dd')
    const newReleaseVideos = await Video.query()
      .select('id')
      .where('release_date', '<=', now)
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .limit(450)

    const videoIds = newReleaseVideos.map((video) => video.id)
    await newReleaseCollection.related('videos').sync(videoIds)
    Logger.info(
      {
        totalVideo: videoIds.length,
      },
      'End calculationNewRelease'
    )
  }

  public static async calculationNewAdded(): Promise<void> {
    Logger.info('Start calculationNewAdded')
    const newAddedCollection = await this.getCollectionBySlug('recent')
    const newReleaseVideos = await Video.query()
      .select('id')
      .where('release_date', '!=', 'undelivered now')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('id', 'desc')
      .limit(450)

    const videoIds = newReleaseVideos.map((video) => video.id)
    await newAddedCollection.related('videos').sync(videoIds)
    Logger.info(
      {
        totalVideo: videoIds.length,
      },
      'End calculationNewAdded'
    )
  }

  public static async calculationPopular(): Promise<void> {
    Logger.info('Start calculationPopular')
    const popularCollection = await this.getCollectionBySlug('popular')
    const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toSQL()
    const popularVideos = await Video.query()
      .select('videos.id')
      .innerJoin('views', 'videos.id', 'views.referer_id')
      .where('views.range', 'day')
      .where('views.created_at', '>=', sevenDaysAgo)
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('views.count', 'desc')
      .limit(450)

    const videoIds = popularVideos.map((video) => video.id)
    await popularCollection.related('videos').sync(videoIds)
    Logger.info(
      {
        totalVideo: videoIds.length,
      },
      'End calculationPopular'
    )
  }
}
