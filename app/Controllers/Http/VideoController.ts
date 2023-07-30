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

  public async favorite({ request, response, auth }: HttpContextContract) {
    const uid = request.param('uid')
    const video = await VideoRepo.getVideoByUid(uid)

    const user = auth.user!
    let state = 'added'

    if (await user.related('favoriteVideos').query().where('video_id', video.id).first()) {
      await user.related('favoriteVideos').detach([video.id])
      state = 'removed'
    } else {
      await user.related('favoriteVideos').attach([video.id])
    }

    return response.json({
      success: true,
      state,
      message: 'Video ' + state + ' to favorites',
    })
  }
}
