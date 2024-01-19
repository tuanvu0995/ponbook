import { EventsList } from '@ioc:Adonis/Core/Event'
import influx from '@ioc:Influx'

export default class Tracker {
  public async onSearched(data: EventsList['tracker:searched']) {
    await influx.writePoint('search:terms', { term: data.term }, { total: data.totalResults })
  }

  public async onVideoViewed(video: EventsList['tracker:videoViewed']) {
    await influx.writePoint('video:views', { videoId: video.id.toString() }, { code: video.code })
  }
}
