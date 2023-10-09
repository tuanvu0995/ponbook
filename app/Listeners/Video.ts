import type { EventsList } from '@ioc:Adonis/Core/Event'
import View from 'App/Models/View'

export default class Video {
  public async onViewed(video: EventsList['video:viewed']) {
    await View.increment('videos', video.id)
  }
}
