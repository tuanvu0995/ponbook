import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFind,
  column,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'

export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Video, {
    pivotTable: 'video_collections',
  })
  public videos: ManyToMany<typeof Video>

  @beforeFind()
  public static whereExceptDeleted(query: ModelQueryBuilderContract<typeof Collection>) {
    query.where('is_deleted', false)
  }
}
