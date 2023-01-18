import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import { nanoid } from 'nanoid'

export default class VideoFilter extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public key: string

  @column()
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Video, {
    pivotTable: 'video_filter_videos',
  })
  public videos: ManyToMany<typeof Video>

  @beforeCreate()
  public static async generateUID(videoFilter: VideoFilter) {
    videoFilter.uid = nanoid()
  }
}
