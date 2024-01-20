import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { PaginatedFilters, PaginatedSorts } from 'App/common/types'
import slugify from 'App/Helpers/slugify'
import meiliSearch from '@ioc:MeiliSearch'

export default class VideoRepo {
  public static async getVideoByUid(
    ctx: HttpContextContract,
    uid: string,
    loadRelation = false
  ): Promise<Video> {
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
      await video.load('casts', (query) => {
        if (ctx.auth.user) {
          query.preload('users', (subQuery) => {
            subQuery.where('users.id', ctx.auth.user!.id)
          })
        }
      })
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
      .withCount('images')
      .where('is_deleted', false)
      .where('is_published', true)
      .first()

    if (_.isNil(video)) {
      throw new NotFoundException(`Video with code ${code} not found`)
    }

    return video
  }

  public static async getRelatedVideos(video: Video, limit: number = 12): Promise<Video[]> {
    const title = slugify(video.title?.replace(video.code, ''), ' ')

    const results = await meiliSearch.search('videos', title, {
      limit,
      filter: `code != ${video.code}`,
      attributesToHighlight: ['title'],
    })

    const videoIds = results.hits.map((hit) => hit.id)
    if (!videoIds.length) return []

    return await VideoRepo.getVideosByIds(videoIds)
  }

  public static async getRecentVideos(
    page: number = 1,
    limit: number = 15,
    filters?: PaginatedFilters
  ): Promise<ModelPaginatorContract<Video>> {
    const recentVideos = await Video.query()
      .preload('cover')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('id', 'desc')
      .filterWithPaginate(page, limit, filters)

    return recentVideos
  }

  public static async getNewCommentAddedVideos(
    page: number = 1,
    limit: number = 15,
    filters?: PaginatedFilters,
    sorts?: PaginatedSorts
  ): Promise<ModelPaginatorContract<Video>> {
    const newlyUpdatedVideos = await Video.query()
      .select('videos.*')
      .where('videos.is_published', true)
      .where('videos.is_deleted', false)
      .innerJoin('comments', 'videos.id', 'comments.video_id')
      .where('comments.is_published', true)
      .orderByRaw('MAX(comments.id) desc')
      .filterWithPaginate(page, limit, filters, sorts)
    for (const video of newlyUpdatedVideos) {
      await video.load('cover')
    }

    return newlyUpdatedVideos
  }

  public static async getNewReleaseVideos(
    page: number = 1,
    limit: number = 15,
    filters?: PaginatedFilters
  ): Promise<ModelPaginatorContract<Video>> {
    const now = DateTime.now().toFormat('yyyy-MM-dd')

    const videos = await Video.query()
      .preload('cover')
      .where('release_date', '<=', now)
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .filterWithPaginate(page, limit, filters)

    return videos
  }

  public static async getPopularVideos(
    page: number = 1,
    limit: number = 15,
    filters?: PaginatedFilters
  ): Promise<ModelPaginatorContract<Video>> {
    const popularVideos = await Video.query()
      .preload('cover')
      .preload('casts')
      .innerJoin('views', 'videos.id', 'views.referer_id')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('view_count_day', 'desc')
      .filterWithPaginate(page, limit, filters)

    return popularVideos
  }

  public static async getVideosByIds(ids: number[]): Promise<Video[]> {
    if (!ids.length) {
      return []
    }
    return await Video.query()
      .preload('cover')
      .whereIn('id', ids)
      .where('is_published', true)
      .where('is_deleted', false)
      .orderByRaw(`FIELD(id, ${ids.join(',')})`)
  }
}
