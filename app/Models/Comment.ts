import {
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Video from './Video'
import generateUid from 'App/Utils/generateUid'
import AppBaseModel from './AppBaseModel'

export default class Comment extends AppBaseModel {
  @column({
    serializeAs: null,
  })
  public userId: number

  @column()
  public uid: string

  @column()
  public content: string

  @column({
    serializeAs: null,
  })
  public videoId: number

  @column({
    serializeAs: null,
  })
  public parentId: number

  @column()
  public isReply: boolean

  @column({
    serializeAs: null,
  })
  public isApproved: boolean

  @column()
  public isBlocked: boolean

  @column()
  public voteUpCount: number

  @column()
  public voteDownCount: number

  @column({
    serializeAs: null,
  })
  public attachmentImages: string

  @column({
    serializeAs: null,
  })
  public isDraft: boolean

  @column({
    serializeAs: null,
  })
  public postId: Number

  @column()
  public name: string

  @column({
    serializeAs: null,
  })
  public email: string

  @column({
    serializeAs: null,
  })
  public ipAddress: string

  @column({
    serializeAs: null,
  })
  public userAgent: string

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Video)
  public video: BelongsTo<typeof Video>

  @belongsTo(() => Comment)
  public parent: BelongsTo<typeof Comment>

  @beforeCreate()
  public static async generateUid(comment: Comment) {
    comment.uid = generateUid()
  }

  @hasMany(() => Comment, {
    foreignKey: 'parentId',
  })
  public replies: HasMany<typeof Comment>

  @manyToMany(() => User, {
    pivotTable: 'votes',
  })
  public voters: ManyToMany<typeof User>
}
