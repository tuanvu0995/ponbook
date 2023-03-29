import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'

export default class VideoManagersController {
  public async index({ request, view }: HttpContextContract) {
    const { page = 1, perPage = 20 } = request.qs()

    const videos = await Video.query()
      .preload('videoCover')
      .preload('casts')
      .orderBy('id', 'desc')
      .paginate(page, perPage)

    videos.baseUrl(`/admin/videos`)

    return view.render('admin/video/index', { videos })
  }
}
