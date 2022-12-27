import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'
import Video from './Video'

export default class Cast extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public image: string

  @column()
  public birthday: DateTime

  @column()
  public productCount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Video)
  public videos: HasMany<typeof Video>

  @beforeCreate()
  public static async generateUID(cast: Cast) {
    cast.uid = nanoid()
  }
}
