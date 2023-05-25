import _ from 'lodash'
import NotFoundException from 'App/Exceptions/NotFoundException'
import Redis from '@ioc:Adonis/Addons/Redis'
import Video from 'App/Models/Video'
import Database from '@ioc:Adonis/Lucid/Database'

export default class VideoRepository {
  public static async getVideoByUid(uid: string): Promise<Video> {
    const video = await Video.query()
      .where('uid', uid)
      .where('is_deleted', false)
      .where('is_published', true)
      .first()
    if (!video) {
      throw new NotFoundException('Video not found')
    }
    return video
  }

  public static async getVideoByCode(code: string, skipError?: boolean): Promise<Video | null> {
    const video = await Video.query().where('code', code).first()
    if (!video && !skipError) {
      throw new NotFoundException('Video not found')
    }
    return video
  }

  public static async updateVideo(videoId: number, data: any): Promise<void> {
    await Video.query().where('id', videoId).update(data)
  }

  public static async getVideoByIds(videoIds: number[]): Promise<Video[]> {
    const videos = await Video.query()
      .preload('videoCover')
      .preload('casts')
      .whereIn('id', videoIds)
    return videos.sort((a, b) => videoIds.indexOf(a.id) - videoIds.indexOf(b.id))
  }

  public async getVideoByUid(uid: string): Promise<Video> {
    const cachedVideo = await Redis.get(`video:${uid}`)
    if (cachedVideo) {
      return JSON.parse(cachedVideo)
    }

    const video = await Video.query().where('uid', uid).first()
    if (!video) {
      throw new NotFoundException('Video not found')
    }

    await video.load('director')
    await video.load('maker')
    await video.load('casts')
    await video.load('tags')
    await video.load('videoCover')
    await video.load('videoImage')
    await video.load('images')

    await Redis.set(`video:${uid}`, JSON.stringify(video.toJSON()))

    return video
  }

  public async getRelatedVideos(video: Video): Promise<Video[]> {
    const cachedRelatedVideos = await Redis.get(`video:${video.uid}:related`)
    if (cachedRelatedVideos) {
      return JSON.parse(cachedRelatedVideos)
    }

    const tagIds = _.chain(video.tags)
      .map((tag) => tag.id)
      .filter((id) => !_.isNil(id))
      .value()
    const randomVideoIds = await Database.from('video_tags')
      .whereIn('tag_id', tagIds)
      .orderByRaw('RAND()')
      .select('video_id')
      .limit(5)

    const relatedVideos = await Video.query().whereIn(
      'id',
      randomVideoIds.map((video) => video.video_id)
    )

    for (const relatedVideo of relatedVideos) {
      await relatedVideo.load('videoCover')
      await relatedVideo.load('casts')
    }

    await Redis.set(`video:${video.uid}:related`, JSON.stringify(relatedVideos))

    return relatedVideos
  }

  public async getRecentVideos(): Promise<Video[]> {
    const cachedRecentVideos = await Redis.get('videos:recent')
    if (cachedRecentVideos) {
      return JSON.parse(cachedRecentVideos)
    }

    const recentVideos = await Video.query()
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('id', 'desc')
      .limit(20)
    for (const video of recentVideos) {
      await video.load('videoCover')
    }

    await Redis.set('videos:recent', JSON.stringify(recentVideos))

    return recentVideos
  }

  public async getNewlyUpdatedVideos(): Promise<Video[]> {
    const newlyUpdatedVideos = await Video.query()
      .select('videos.*')
      .where('videos.is_published', true)
      .where('videos.is_deleted', false)
      .innerJoin('comments', 'videos.id', 'comments.video_id')
      .where('comments.is_blocked', false)
      .where('comments.is_draft', false)
      .orderByRaw('MAX(comments.id) desc')
      .groupBy('videos.id')
      .limit(20)
    for (const video of newlyUpdatedVideos) {
      await video.load('videoCover')
    }

    return newlyUpdatedVideos
  }

  public static async getVideoByUids(uids: string[]): Promise<Video[]> {
    const videos = await Video.query()
      .whereIn('uid', uids)
      .where('is_deleted', false)
      .where('is_published', true)
    return videos
  }
}
