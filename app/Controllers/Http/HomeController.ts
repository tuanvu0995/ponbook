import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    const videos = await Video.query().preload('casts').orderBy('id', 'desc').limit(10)

    for (const video of videos) {
      await video.preloadImages()
    }

    return view.render('index', { videos })
  }
}
