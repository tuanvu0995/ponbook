import { DateTime } from 'luxon'
import _ from 'lodash'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'
import Video from './Video'
import slugify from 'App/utils/slugify'

export default class Cast extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public slug: string

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

  @column()
  public cup: string

  @column()
  public jpName: string

  @column()
  public favoriteCount: number

  @column()
  public subscribedCount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Video, {
    pivotTable: 'video_casts',
  })
  public videos: ManyToMany<typeof Video>

  @beforeCreate()
  public static async generateUID(cast: Cast) {
    cast.uid = nanoid()
  }

  @beforeSave()
  public static async generateSlug(cast: Cast) {
    cast.slug = slugify(cast.name)

    if (_.endsWith(cast.slug, '-')) {
      cast.slug = cast.slug.slice(0, -1)
    }

    let count = 1
    while (count) {
      const exists = await Cast.query().whereNot('id', cast.id).where('slug', cast.slug).first()
      if (!exists) break
      cast.slug = `${cast.slug}-${count}`
      count++
    }
  }
}
