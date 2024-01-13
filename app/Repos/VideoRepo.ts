import _ from 'lodash'
import Video from 'App/Models/Video'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Database from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { PaginatedFilters, PaginatedSorts } from 'App/common/types'

export default class VideoRepo {
  public static async getVideoByUid(uid: string, loadRelation = false): Promise<Video> {
    const video = await Video.query()
      .where('uid', uid)
      .where('is_deleted', false)
      .where('is_published', true)
      .first()

    if (_.isNil(video)) {
      throw new NotFoundException(`Video with uid ${uid} not found`)
    }

    if (loadRelation) {
      await video.load('director')
      await video.load('maker')
      await video.load('casts')
      await video.load('tags')
      await video.load('cover')
      await video.load('image')
      await video.load('images')
    }

    return video
  }

  public static async getVideoByCode(code: string): Promise<Video> {
    const video = await Video.query()
      .where('code', code)
      .where('is_deleted', false)
      .where('is_published', true)
      .first()

    if (_.isNil(video)) {
      throw new NotFoundException(`Video with code ${code} not found`)
    }

    return video
  }

  public static async getRelatedVideos(video: Video, limit: number = 12): Promise<Video[]> {
    if (!video.tags?.length) {
      await video.load('tags')
    }

    const tagIds = _.chain(video.tags)
      .map((tag) => tag.id)
      .filter((id) => !_.isNil(id))
      .value()

    const randomNumber = Date.now() * 1000 + Math.floor(Math.random() * 1000)
    const randomVideoIds = await Database.from('video_tags')
      .whereIn('tag_id', tagIds)
      .orderByRaw(`RAND(${randomNumber})`)
      .select('video_id')
      .limit(limit)

    const relatedVideos = await Video.query()
      .whereIn(
        'id',
        randomVideoIds.map((video) => video.video_id)
      )
      .preload('cover')
      .preload('casts')
      .where('is_deleted', false)
      .where('is_published', true)

    return relatedVideos
  }

  public static async getRecentVideos(
    page: number = 1,
    limit: number = 15,
    sorts: PaginatedSorts,
    filters: PaginatedFilters
  ): Promise<ModelPaginatorContract<Video>> {
    const recentVideos = await Video.query()
      .preload('cover')
      .where('is_published', true)
      .where('is_deleted', false)
      .filterWithPaginate(filters, sorts, page, limit)

    return recentVideos
  }

  public static async getNewCommentAddedVideos(
    page: number = 1,
    limit: number = 15,
    sorts: PaginatedSorts,
    filters: PaginatedFilters
  ): Promise<ModelPaginatorContract<Video>> {
    const newlyUpdatedVideos = await Video.query()
      .select('videos.*')
      .where('videos.is_published', true)
      .where('videos.is_deleted', false)
      .innerJoin('comments', 'videos.id', 'comments.video_id')
      .where('comments.is_published', true)
      .orderByRaw('MAX(comments.id) desc')
      .filterWithPaginate(filters, sorts, page, limit)
    for (const video of newlyUpdatedVideos) {
      await video.load('cover')
    }

    return newlyUpdatedVideos
  }

  public static async getNewReleaseVideos(
    page: number = 1,
    limit: number = 15,
    sorts: PaginatedSorts,
    filters: PaginatedFilters
  ): Promise<ModelPaginatorContract<Video>> {
    const now = DateTime.now().toFormat('yyyy-MM-dd')

    const videos = await Video.query()
      .preload('cover')
      .where('release_date', '<=', now)
      .where('is_published', true)
      .where('is_deleted', false)
      .filterWithPaginate(filters, sorts, page, limit)

    return videos
  }

  public static async getPopularVideos(
    page: number = 1,
    limit: number = 15,
    _: PaginatedSorts,
    filters: PaginatedFilters
  ): Promise<ModelPaginatorContract<Video>> {
    const sevenDaysAgo = DateTime.now().minus({ year: 1 }).toSQL()
    const popularVideos = await Video.query()
      .preload('cover')
      .preload('casts')
      .innerJoin('views', 'videos.id', 'views.referer_id')
      .where('views.range', 'day')
      .where('views.created_at', '>=', sevenDaysAgo)
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('views.count', 'desc')
      .filterWithPaginate(filters, {}, page, limit)

    return popularVideos
  }

  public static async getVideosByIds(ids: number[]): Promise<Video[]> {
    return await Video.query()
      .preload('cover')
      .whereIn('id', ids)
      .where('is_published', true)
      .where('is_deleted', false)
      .orderByRaw(`FIELD(id, ${ids.join(',')})`)
  }
}
