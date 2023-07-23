import {
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
import AppBaseModel from './AppBaseModel'

export default class Box extends AppBaseModel {
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
