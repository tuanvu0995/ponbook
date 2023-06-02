import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  beforeCreate,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Video from './Video'
import uniqid from 'uniqid'

export default class Box extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public viewCount: number

  @column()
  public isDraft: boolean

  @column()
  public isPublic: boolean

  @column()
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Video, {
    pivotTable: 'box_videos',
    pivotTimestamps: true,
  })
  public videos: ManyToMany<typeof Video>

  @beforeCreate()
  public static async generateUid(box: Box) {
    box.uid = uniqid()
  }
}