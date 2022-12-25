import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'
import Cast from './Cast'
import Director from './Director'
import Maker from './Maker'
import User from './User'
import Tag from './Tag'
import Comment from './Comment'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public userId: number

  @column()
  public code: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public image: string

  @column()
  public images: string

  @column()
  public video: string

  @column()
  public directorId: number

  @column()
  public makerId: number

  @column()
  public castId: number

  @column()
  public releaseDate: string

  @column()
  public duration: string

  @column()
  public rate: number

  @column()
  public rateCount: number

  @column()
  public viewCount: number

  @column()
  public commentCount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUID(video: Video) {
    video.uid = nanoid()
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Cast)
  public cast: BelongsTo<typeof Cast>

  @belongsTo(() => Director)
  public director: BelongsTo<typeof Director>

  @belongsTo(() => Maker)
  public maker: BelongsTo<typeof Maker>

  @manyToMany(() => Tag, {
    pivotTable: 'video_tags',
  })
  public tags: ManyToMany<typeof Tag>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>
}
