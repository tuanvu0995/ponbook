import { DateTime } from 'luxon'
import _ from 'lodash'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'
import Video from './Video'
import slugify from 'App/utils/slugify'
import File from './File'

export default class Cast extends BaseModel {

  @column({ isPrimary: true, serializeAs: null })
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
  public imageFileId: number

  @column()
  public birthday: DateTime

  @column()
  public productCount: number

  @column()
  public cup?: string

  @column()
  public jpName?: string

  @column()
  public cityOfBorn?: DateTime

  @column()
  public height?: string

  @column()
  public hobby?: string

  @column()
  public bloodType?: string

  @column()
  public skill?: string

  @column()
  public other?: string

  @column()
  public favoriteCount: number

  @column()
  public subscribedCount: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => File, {
    foreignKey: 'imageFileId',
  })
  public castImage: BelongsTo<typeof File>

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
      const exists = await Cast.query()
        .where((qs) => {
          if (cast.id) {
            qs.whereNot('id', cast.id)
          }
        })
        .where('slug', cast.slug)
        .first()
      if (!exists) break
      cast.slug = `${cast.slug}-${count}`
      count++
    }
  }

  public static async getCastByName(name: string, exceptIds: number[] = []) {
    const reName = name.split(' ').reverse().join(' ')
    const cast = await Cast.query()
      .whereNotIn('id', exceptIds)
      .where((qs) => {
        qs.where('name', name).orWhere('name', reName)
      })
      .first()
    return cast
  }
}
