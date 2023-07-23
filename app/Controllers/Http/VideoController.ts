import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import VideoRepo from 'App/Repos/VideoRepo'

export default class VideoController {
  public async show({ params, response }: HttpContextContract) {
    const { uid } = params
    const video = await VideoRepo.getVideoByUid(uid, true)

    if (_.isNil(video)) throw new NotFoundException('Video not found')

    return response.json(video)
  }

  public async getRelatedVideos({ params, response }: HttpContextContract) {
    const video = await VideoRepo.getVideoByUid(params.uid)
    const relatedVideos = await VideoRepo.getRelatedVideos(video)
    return response.json(relatedVideos)
  }
}
