import type { EventsList } from '@ioc:Adonis/Core/Event'
import Redis from '@ioc:Adonis/Addons/Redis'

export default class Video {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async onVideoCreated(_: EventsList['video:created']) {
    await Redis.del([
      'videos:recent',
      'video:newly-updated',
      'collections:home',
      'video:newly-updated',
    ])
  }
  public async onVideoUpdated(video: EventsList['video:updated']) {
    await Redis.del([
      `video:${video.uid}`,
      `video:${video.uid}:related`,
      'collections:home',
      'video:newly-updated',
      'video:recent',
    ])
  }
}
