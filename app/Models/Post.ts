import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'
import User from './User'
import Comment from './Comment'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public parentId: number

  @column()
  public uid: string

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public isPublished: boolean

  @column()
  public isDraft: boolean

  @column()
  public isDeleted: boolean

  @column()
  public isTop: boolean

  @column()
  public voteUpCount: number

  @column()
  public voteDownCount: number

  @column()
  public commentsCount: number

  @column()
  public viewsCount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(post: Post) {
    post.uid = nanoid()
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  public parent: BelongsTo<typeof Post>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @manyToMany(() => User, {
    pivotTable: 'votes',
  })
  public voters: ManyToMany<typeof User>
}
