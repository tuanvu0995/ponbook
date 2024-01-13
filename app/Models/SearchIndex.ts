import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'

export default class SearchIndex extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public term: string

  @column()
  public videoId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Video)
  public videos: HasMany<typeof Video>
}
