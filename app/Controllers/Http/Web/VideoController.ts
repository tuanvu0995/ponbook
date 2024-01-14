import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepo from 'App/Repos/VideoRepo'
import Event from '@ioc:Adonis/Core/Event'

export default class VideoController {
  public async show({ params, view }: HttpContextContract) {
    const video = await VideoRepo.getVideoByUid(params.uid, true)

    const relatedVideos = await VideoRepo.getRelatedVideos(video, 18)

    const title = `${video.title} - ${video.title}`
    const description = video.description
    const keywords = video.tags.map((tag) => tag.name)

    Event.emit('video:viewed', video)

    return view.render('video', { video, relatedVideos, title, description, keywords })
  }
}
