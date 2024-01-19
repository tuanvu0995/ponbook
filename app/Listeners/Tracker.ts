import { EventsList } from '@ioc:Adonis/Core/Event'
import influx from '@ioc:Influx'

export default class Tracker {
  public async onSearched(data: EventsList['tracker:searched']) {
    await influx.writePoint('search:terms', { term: data.term }, { total: data.totalResults })
  }

  public async onVideoViewed({ video, tracker }: EventsList['tracker:videoViewed']) {
    const trackingId = tracker?.trackingId ? tracker.trackingId : 'none'
    const userId = tracker ? tracker.id : 0
    await influx.writePoint(
      'video:views',
      { code: video.code, trackingId },
      { videoId: video.id, userId }
    )
  }
}
