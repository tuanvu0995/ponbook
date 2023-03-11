import type { EventsList } from '@ioc:Adonis/Core/Event'
import Redis from '@ioc:Adonis/Addons/Redis'

export default class Video {
  public async onVideoCreated(_video: EventsList['video:created']) {
    await Redis.del(['videos:recent', 'video:newly-updated', 'collections:home'])
  }
  public async onVideoUpdated(video: EventsList['video:updated']) {
    await Redis.del([`video:${video.uid}`, `video:${video.uid}:related`])
  }
}
