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
import User from './User'
import { nanoid } from 'nanoid'
import Video from './Video'

export default class Comment extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: null })
  public userId: number

  @column()
  public uid: string

  @column()
  public content: string

  @column({ serializeAs: null })
  public videoId: number

  @column({ serializeAs: null })
  public parentId: number

  @column()
  public isReply: boolean

  @column({ serializeAs: null })
  public isApproved: boolean

  @column()
  public isBlocked: boolean

  @column()
  public voteUpCount: number

  @column()
  public voteDownCount: number

  @column()
  public attachmentImages: string

  @column({ serializeAs: null })
  public isDraft: boolean

  @column()
  public name: string

  @column({ serializeAs: null })
  public email: string

  @column({ serializeAs: null })
  public ipAddress: string

  @column({ serializeAs: null })
  public userAgent: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Video)
  public video: BelongsTo<typeof Video>

  @belongsTo(() => Comment)
  public parent: BelongsTo<typeof Comment>

  @beforeCreate()
  public static async generateUid(comment: Comment) {
    comment.uid = nanoid()
  }

  @hasMany(() => Comment, {
    foreignKey: 'parentId',
  })
  public replies: HasMany<typeof Comment>

  @manyToMany(() => User, {
    pivotTable: 'votes',
  })
  public voters: ManyToMany<typeof User>

  public static async getCommentsByVideo(video: Video, page, limit) {
    const comments = await Comment.query()
      .where('video_id', video.id)
      .where('is_draft', false)
      .preload('owner')
      .paginate(page, limit)

    comments.baseUrl('/v/' + video.uid).queryString({ page: page, limit })
    return comments
  }
}
