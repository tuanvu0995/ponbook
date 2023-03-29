import NotFoundException from 'App/Exceptions/NotFoundException'
import Redis from '@ioc:Adonis/Addons/Redis'
import Video from 'App/Models/Video'

export default class VideoRepository {
  constructor() {}

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

    const tagIds = video.tags.map((tag) => tag.id)
    const relatedVideos = await Video.query()
      .preload('videoCover')
      .preload('casts')
      .innerJoin('video_tags', 'videos.id', 'video_tags.video_id')
      .whereIn('video_tags.tag_id', tagIds)
      .where('videos.id', '!=', video.id)
      .groupBy('videos.id')
      .orderByRaw('RAND()')
      .limit(8)

    await Redis.set(`video:${video.uid}:related`, JSON.stringify(relatedVideos))

    return relatedVideos
  }

  public async getRecentVideos(): Promise<Video[]> {
    const cachedRecentVideos = await Redis.get('video:recent')
    if (cachedRecentVideos) {
      return JSON.parse(cachedRecentVideos)
    }

    const recentVideos = await Video.query()
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('created_at', 'desc')
      .limit(12)
    for (const video of recentVideos) {
      await video.load('videoCover')
    }

    await Redis.set('video:recent', JSON.stringify(recentVideos))

    return recentVideos
  }

  public async getNewlyUpdatedVideos(): Promise<Video[]> {
    const cachedNewlyUpdatedVideos = await Redis.get('video:newly-updated')
    if (cachedNewlyUpdatedVideos) {
      return JSON.parse(cachedNewlyUpdatedVideos)
    }

    const newlyUpdatedVideos = await Video.query()
      .innerJoin('comments', 'videos.id', 'comments.video_id')
      .where('videos.is_published', true)
      .where('comments.is_blocked', false)
      .where('comments.is_draft', false)
      .where('videos.is_deleted', false)
      .select('videos.*')
      .orderBy('videos.updated_at', 'desc')
      .groupBy('videos.id')
      .limit(12)
    for (const video of newlyUpdatedVideos) {
      await video.load('videoCover')
    }

    await Redis.set('video:newly-updated', JSON.stringify(newlyUpdatedVideos))

    return newlyUpdatedVideos
  }
}
