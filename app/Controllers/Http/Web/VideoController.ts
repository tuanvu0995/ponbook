import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepo from 'App/Repos/VideoRepo'

export default class VideoController {
  public async show({ params, view }: HttpContextContract) {
    const video = await VideoRepo.getVideoByUid(params.uid)
    return view.render('video', { video })
  }
}
