import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'
import Video from './Video'

export default class Director extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public productCount: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => Video)
  public videos: HasMany<typeof Video>

  @beforeCreate()
  public static async generateUID(director: Director) {
    director.uid = nanoid()
  }
}
