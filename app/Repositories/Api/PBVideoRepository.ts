import Redis from '@ioc:Adonis/Addons/Redis'
import Video from 'App/Models/Video'
import NotFoundException from 'App/Exceptions/NotFoundException'

export default class PBVideoRepository {
  public static async getVideoByUid(uid: string): Promise<any> {
    const existsVideo = await Redis.get(`video:${uid}`)
    if (existsVideo) return JSON.parse(existsVideo)

    const video = await Video.query()
      .where('uid', uid)
      .where('is_deleted', false)
      .where('is_published', true)
      .first()
    if (!video) {
      throw new NotFoundException(`Video with ID ${uid} not found`)
    }

    await video.load('director')
    await video.load('maker')
    await video.load('casts')
    await video.load('tags')
    await video.load('videoCover')
    await video.load('videoImage')
    await video.load('images')

    const serializedVideo = video.serialize({
      fields: {
        pick: [
          'id',
          'uid',
          'code',
          'title',
          'description',
          'cover',
          'image',
          'release_date',
          'duration',
          'rate',
          'rate_count',
          'view_count',
          'comment_count',
        ],
      },
      relations: {
        director: {
          fields: {
            pick: ['uid', 'name', 'slug'],
          },
        },
        maker: {
          fields: {
            pick: ['uid', 'name', 'slug'],
          },
        },
        casts: {
          fields: {
            pick: ['name', 'slug'],
          },
        },
        tags: {
          fields: {
            pick: ['id', 'name', 'slug'],
          },
        },
        videoCover: {
          fields: {
            pick: ['path', 'thumbnail_path', 'width', 'height'],
          },
        },
        videoImage: {
          fields: {
            pick: ['path', 'thumbnail_path', 'width', 'height'],
          },
        },
        images: {
          fields: {
            pick: ['path', 'thumbnail_path', 'width', 'height'],
          },
        },
      },
    })

    await Redis.set(`video:${uid}`, JSON.stringify(serializedVideo))

    return serializedVideo
  }
}
