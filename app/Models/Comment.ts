import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public uid: string

  @column()
  public content: string

  @column()
  public videoId: number

  @column()
  public parentId: number

  @column()
  public isReply: boolean

  @column()
  public isApproved: boolean

  @column()
  public isBlocked: boolean

  @column()
  public voteUpCount: number

  @column()
  public voteDownCount: number

  @column()
  public attachmentImages: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Comment)
  public parent: BelongsTo<typeof Comment>
}
