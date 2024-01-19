import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepo from 'App/Repos/VideoRepo'
import Event from '@ioc:Adonis/Core/Event'

export default class VideoController {
  public async show(ctx: HttpContextContract) {
    const { params, view } = ctx
    const video = await VideoRepo.getVideoByUid(ctx, params.uid, true)

    const relatedVideos = await VideoRepo.getRelatedVideos(video, 36)

    const title = `${video.title} - ${video.title}`
    const description = video.description
    const keywords = video.tags.map((tag) => tag.name)

    Event.emit('tracker:videoViewed', {
      video,
      tracker: ctx.auth.user,
    })

    return view.render('video', { video, relatedVideos, title, description, keywords })
  }
}
