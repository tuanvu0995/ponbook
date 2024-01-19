import type { EventsList } from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'

export default class Video {
  public async onCreated(video: EventsList['video:created']) {
    Logger.info('Video created', video.code)
  }

  public async onUpdated(video: EventsList['video:updated']) {
    Logger.info('Video updated', video.code)
  }
}
