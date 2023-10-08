import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  ManyToMany,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import User from './User'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

export type CommentVote = 'up' | 'down'

export default class Comment extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uid: string

  @column()
  public userId: number

  @column()
  public videoId: number

  @column()
  public parentId?: number

  @column()
  public title?: string

  @column()
  public content: string

  @column()
  public htmlContent: string

  @column()
  public isPublished: boolean

  @column()
  public views: number

  @column()
  public upVotes: number

  @column()
  public downVotes: number

  @column()
  public shareCounts: number

  @column()
  public commentCounts: number

  @column.dateTime()
  public publishedAt?: DateTime | null

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Comment)
  public comment: BelongsTo<typeof Comment>

  @manyToMany(() => User, {
    pivotTable: 'post_votes',
    pivotColumns: ['vote'],
    pivotTimestamps: true,
  })
  public votes: ManyToMany<typeof User>

  @hasMany(() => Comment, {
    foreignKey: 'parentId',
  })
  public comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null

  @beforeCreate()
  public static async generateUid(comment: Comment) {
    comment.uid = uniqid()
  }

  public async increaseVote(vote: CommentVote) {
    await Database.transaction(async (trx) => {
      this.upVotes += vote === 'up' ? 1 : 0
      this.downVotes += vote === 'down' ? 1 : 0
      this.useTransaction(trx)
      await this.save()
    })
  }

  public async decreaseVote(vote: CommentVote) {
    await Database.transaction(async (trx) => {
      this.upVotes -= vote === 'up' ? 1 : 0
      this.downVotes -= vote === 'down' ? 1 : 0
      this.useTransaction(trx)
      await this.save()
    })
  }

  public async increaseComment() {
    await Database.transaction(async (trx) => {
      this.commentCounts++
      this.useTransaction(trx)
      await this.save()
    })
  }
}
