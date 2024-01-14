import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepo from 'App/Repos/VideoRepo'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    const popularVideos = await VideoRepo.getPopularVideos(1, 18)
    const newReleasedVideos = await VideoRepo.getNewReleaseVideos(1, 18)
    const recentVideos = await VideoRepo.getRecentVideos(1, 18)

    return view.render('index', {
      popularVideos,
      newReleasedVideos,
      recentVideos,
    })
  }
}
