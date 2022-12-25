import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'

export default class VideoController {
  public async index({ view }: HttpContextContract) {
    return view.render('videos/index')
  }

  public async create({ response }: HttpContextContract) {
    const video = new Video()
    video.title = 'untitled'
    await video.save()
    return response.redirect().toRoute('videos.edit', { uid: video.uid })
  }

  public async edit({ params, view }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    return view.render('videos/edit', { video })
  }
}
