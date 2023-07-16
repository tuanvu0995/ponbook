import _ from 'lodash'
import Video from 'App/Models/Video'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Database from '@ioc:Adonis/Lucid/Database'

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
      await video.load('videoCover')
      await video.load('videoImage')
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

  public static async getRelatedVideos(video: Video, limit: number = 10): Promise<Video[]> {
    const tagIds = _.chain(video.tags)
      .map((tag) => tag.id)
      .filter((id) => !_.isNil(id))
      .value()
    const randomVideoIds = await Database.from('video_tags')
      .whereIn('tag_id', tagIds)
      .orderByRaw('RAND()')
      .select('video_id')
      .limit(Math.min(limit, 15))

    const relatedVideos = await Video.query()
      .whereIn(
        'id',
        randomVideoIds.map((video) => video.video_id)
      )
      .preload('videoCover')
      .preload('casts')

    return relatedVideos
  }

  public static async getRecentVideos(page: number = 1, limit: number = 15): Promise<Video[]> {
    const recentVideos = await Video.query()
      .preload('videoCover')
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('id', 'desc')
      .paginate(page, limit)

    return recentVideos
  }

  public static async getNewCommentAddedVideos(
    page: number = 1,
    limit: number = 15
  ): Promise<Video[]> {
    const newlyUpdatedVideos = await Video.query()
      .select('videos.*')
      .where('videos.is_published', true)
      .where('videos.is_deleted', false)
      .innerJoin('comments', 'videos.id', 'comments.video_id')
      .where('comments.is_blocked', false)
      .where('comments.is_draft', false)
      .orderByRaw('MAX(comments.id) desc')
      .groupBy('videos.id')
      .paginate(page, limit)
    for (const video of newlyUpdatedVideos) {
      await video.load('videoCover')
    }

    return newlyUpdatedVideos
  }
}
