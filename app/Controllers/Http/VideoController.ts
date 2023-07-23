import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cache from '@ioc:Adonis/Addons/Cache'
import { CacheTimes } from 'Config/constants'
import Video from 'App/Models/Video'
import NotFoundException from 'App/Exceptions/NotFoundException'
import VideoRepo from 'App/Repos/VideoRepo'
import VideoTransform from 'App/Transforms/VideoTransform'

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
    VideoTransform.transform(relatedVideos)
    return response.json(relatedVideos)
  }
}
