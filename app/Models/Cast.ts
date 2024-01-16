import { DateTime } from 'luxon'
import _ from 'lodash'
import {
  beforeCreate,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import slugify from 'App/Helpers/slugify'
import File from './File'
import generateUid from 'App/Helpers/generateUid'
import AppBaseModel from './AppBaseModel'
import User from './User'

export default class Cast extends AppBaseModel {
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

  @column({ serializeAs: null })
  public imageFileId: number

  @column()
  public birthday: DateTime

  @column()
  public productCount: number

  @column({ serializeAs: null })
  public cup?: string

  @column({ serializeAs: null })
  public jpName?: string

  @column({ serializeAs: null })
  public cityOfBorn?: DateTime

  @column({ serializeAs: null })
  public height?: string

  @column({ serializeAs: null })
  public hobby?: string

  @column({ serializeAs: null })
  public bloodType?: string

  @column({ serializeAs: null })
  public skill?: string

  @column({ serializeAs: null })
  public other?: string

  @column()
  public favoriteCount: number

  @column()
  public subscribedCount: number

  @belongsTo(() => File, {
    foreignKey: 'imageFileId',
  })
  public photo: BelongsTo<typeof File>

  @manyToMany(() => Video, {
    pivotTable: 'video_casts',
  })
  public videos: ManyToMany<typeof Video>

  @manyToMany(() => User, {
    pivotTable: 'users_casts',
  })
  public users: ManyToMany<typeof User>

  @beforeCreate()
  public static async generateUID(cast: Cast) {
    cast.uid = generateUid()
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
