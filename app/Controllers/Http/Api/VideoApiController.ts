import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepo from 'App/Repos/VideoRepo'
import { FavoriteStatus } from 'App/common/types'

export default class VideoApiController {
  public async favorite({ request, response, auth }: HttpContextContract) {
    const uid = request.param('uid')
    const video = await VideoRepo.getVideoByUid(uid)

    const user = auth.user!
    let state: FavoriteStatus = 'added'

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

  public async getVideoByCode({ request, response }: HttpContextContract) {
    const code = request.input('code')
    const includes = request.input('includes', [])

    const video = await VideoRepo.getVideoByCode(code)

    if (!includes.length) {
      return response.json(video)
    }

    await Promise.all(includes.map(async (include) => await video.load(include)))

    return response.json(video)
  }
}
