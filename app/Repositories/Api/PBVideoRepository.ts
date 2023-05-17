import _ from 'lodash'
import Video from 'App/Models/Video'
import NotFoundException from 'App/Exceptions/NotFoundException'
import type { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'
import Database from '@ioc:Adonis/Lucid/Database'

export default class PBVideoRepository {
  public static async getVideoByUid(uid: string, skipRelation = false): Promise<Video> {
    const video = await Video.query()
      .where('uid', uid)
      .where('is_deleted', false)
      .where('is_published', true)
      .first()
    if (!video) throw new NotFoundException(`Video with UID ${uid} not found`)

    if (!skipRelation) {
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

  public static async getRecentAddedVideos(
    limit = 10,
    page = 1,
    paginate = false
  ): Promise<SimplePaginatorContract<Video> | Video[]> {
    const limitInt = Math.min(limit, 50)
    const pageInt = Math.max(page, 1)

    const query = Video.query()
      .preload('cover')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('id', 'desc')

    if (paginate) {
      return await query.paginate(pageInt, limitInt)
    }
    return await query.limit(limitInt)
  }

  public static async getNewCommentAddedVideos(
    limit = 10,
    page = 1,
    paginate = false
  ): Promise<SimplePaginatorContract<Video> | Video[]> {
    const limitInt = Math.min(limit, 50)
    const pageInt = Math.max(page, 1)

    const query = Video.query()
      .preload('cover')
      .select('videos.*')
      .where('videos.is_published', true)
      .where('videos.is_deleted', false)
      .innerJoin('comments', 'videos.id', 'comments.video_id')
      .where('comments.is_blocked', false)
      .where('comments.is_draft', false)
      .orderByRaw('MAX(comments.id) desc')
      .groupBy('videos.id')

    if (paginate) {
      return await query.paginate(pageInt, limitInt)
    }
    return await query.limit(limitInt)
  }

  public static async getRelatedVideos(uid: string, limit = 7): Promise<Video[]> {
    const video = await this.getVideoByUid(uid, true)
    await video.load('tags', (query) => query.limit(5))

    const tagIds = _.chain(video.tags)
      .map((tag) => tag.id)
      .filter((id) => !_.isNil(id))
      .value()

    const randomVideoIds = await Database.from('video_tags')
      .whereIn('tag_id', tagIds)
      .orderByRaw('RAND()')
      .select('video_id')
      .limit(limit)

    const relatedVideos = await Video.query().whereIn(
      'id',
      randomVideoIds.map((video) => video.video_id)
    )

    for (const relatedVideo of relatedVideos) {
      await relatedVideo.load('cover')
      await relatedVideo.load('casts')
    }

    return relatedVideos
  }
}
