import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepo from 'App/Repos/VideoRepo'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    const popularVideos = await VideoRepo.getPopularVideos(1, 16)

    return view.render('index', {
      popularVideos,
    })
  }
}
