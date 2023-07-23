import {
  beforeFind,
  column,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import AppBaseModel from './AppBaseModel'

export default class Collection extends AppBaseModel {
  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public isDeleted: boolean

  @manyToMany(() => Video, {
    pivotTable: 'video_collections',
  })
  public videos: ManyToMany<typeof Video>

  @beforeFind()
  public static whereExceptDeleted(query: ModelQueryBuilderContract<typeof Collection>) {
    query.where('is_deleted', false)
  }
}
