import { CherryPick } from '@ioc:Adonis/Lucid/Orm'
import { BaseTransform } from './BaseTransform'
import { CastFields } from './CastTransform'
import { FileFields } from './FileTransform'

export const VideoFields: CherryPick = {
  fields: {
    pick: [
      'uid',
      'title',
      'release_date',
      'duration',
      'rate',
      'rate_count',
      'view_count',
      'comment_count',
    ],
  },
  relations: {
    casts: CastFields,
    videoCover: FileFields,
  },
}

class VideoTransform extends BaseTransform {
  public cherryPick: CherryPick = VideoFields
}

export default new VideoTransform()
