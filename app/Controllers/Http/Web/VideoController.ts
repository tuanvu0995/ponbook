import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepo from 'App/Repos/VideoRepo'

export default class VideoController {
  public async show({ params, view }: HttpContextContract) {
    const video = await VideoRepo.getVideoByUid(params.uid, true)

    const relatedVideos = await VideoRepo.getRelatedVideos(video, 18)

    const title = `${video.title} - ${video.title}`
    const description = video.description
    const keywords = video.tags.map((tag) => tag.name)

    return view.render('video', { video, relatedVideos, title, description, keywords })
  }
}
