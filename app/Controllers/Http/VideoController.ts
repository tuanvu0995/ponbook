import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cache from '@ioc:Adonis/Addons/Cache'
import { CacheTimes } from 'Config/constants'
import Video from 'App/Models/Video'
import VideoRepository from 'App/Repositories/VideoRepository'
import NotFoundException from 'App/Exceptions/NotFoundException'
import VideoRepo from 'App/Repos/VideoRepo'
import { HttpRequestPagination } from '@ioc:Contracts'

export default class VideoController {
  public async show({ params, response }: HttpContextContract) {
    const { uid } = params
    const video = (await Cache.remember<Video>(
      `video:${uid}`,
      CacheTimes.THREE_HOURS,
      async () => await VideoRepository.getVideoByUid(uid, true)
    ))!

    if (_.isNil(video)) throw new NotFoundException('Video not found')

    return response.json(video)
  }

  public async index({
    request,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const { sort, ...filter } = request.qs()
    const videos = await VideoRepository.getVideos(filter, sort, pagination)
    return response.json(
      videos.serialize({
        fields: {
          pick: [
            'uid',
            'title',
            'release_date',
            'duration',
            'rate',
            'rate_count',
            'view_count',
            'comment_count',
          ],
        },
        relations: {
          casts: {
            fields: {
              pick: ['id', 'name', 'slug'],
            },
          },
          videoCover: {
            fields: {
              pick: ['path', 'thumbnail_path', 'height', 'width'],
            },
          },
        },
      })
    )
  }

  public async getRelatedVideos({ params, response }: HttpContextContract) {
    const video = (await Cache.remember<Video>(
      `video:${params.uid}`,
      CacheTimes.THREE_HOURS,
      async () => await VideoRepo.getVideoByUid(params.uid, true)
    ))!
    const relatedVideos = await VideoRepository.getRelatedVideos(video)
    return response.json(relatedVideos)
  }
}
