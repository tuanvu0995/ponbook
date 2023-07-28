import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepo from 'App/Repos/VideoRepo'

export default class VideoController {
  public async show({ params, response }: HttpContextContract) {
    const { uid } = params
    const video = await VideoRepo.getVideoByUid(uid, true)
    return response.json(video)
  }

  public async getRelatedVideos({ params, response }: HttpContextContract) {
    const video = await VideoRepo.getVideoByUid(params.uid)
    const relatedVideos = await VideoRepo.getRelatedVideos(video)
    return response.json(relatedVideos)
  }
}
