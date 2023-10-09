import {
  beforeCreate,
  beforeFind,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Cast from './Cast'
import Director from './Director'
import Maker from './Maker'
import User from './User'
import Tag from './Tag'
import Comment from './Comment'
import File from './File'
import slugify from 'App/Helpers/slugify'
import AppBaseModel from './AppBaseModel'
import Category from './Category'

export default class Video extends AppBaseModel {
  @column({ serializeAs: null })
  public userId: number

  @column()
  public code: string

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public description: string

  @column({ serializeAs: null })
  public coverFileId: number

  @column({ serializeAs: null })
  public imageFileId: number

  @column({ serializeAs: null })
  public video: string

  @column({ serializeAs: null })
  public directorId: number

  @column({ serializeAs: null })
  public makerId: number

  @column()
  public releaseDate: string

  @column()
  public duration: number

  @column()
  public rate: number

  @column()
  public rateCount: number

  @column()
  public viewCount: number

  @column()
  public commentCount: number

  @column({ serializeAs: null })
  public isDraft: boolean

  @column({ serializeAs: null })
  public isPublished: boolean

  @column({ serializeAs: null })
  public isDeleted: boolean

  @column({ serializeAs: null })
  public hasTorrent: boolean

  @column({ serializeAs: null })
  public version: number

  @column({ serializeAs: null })
  public updatedBy: string

  @beforeCreate()
  public static async version2(video: Video) {
    video.version = 2
  }

  @beforeSave()
  public static async generateSlug(video: Video) {
    video.title = video.title.substring(0, 255)
    video.slug = slugify(video.title)
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Cast, {
    pivotTable: 'video_casts',
  })
  public casts: ManyToMany<typeof Cast>

  @belongsTo(() => Director)
  public director: BelongsTo<typeof Director>

  @belongsTo(() => Maker)
  public maker: BelongsTo<typeof Maker>

  @manyToMany(() => Tag, {
    pivotTable: 'video_tags',
  })
  public tags: ManyToMany<typeof Tag>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @belongsTo(() => File, {
    foreignKey: 'coverFileId',
  })
  public cover: BelongsTo<typeof File>

  @belongsTo(() => File, {
    foreignKey: 'imageFileId',
  })
  public image: BelongsTo<typeof File>

  @manyToMany(() => File, {
    pivotTable: 'video_files',
  })
  public images: ManyToMany<typeof File>

  @manyToMany(() => Category, {
    pivotTable: 'category_videos',
  })
  public categories: ManyToMany<typeof Category>

  @beforeFind()
  public static where(query: ModelQueryBuilderContract<typeof Video>) {
    query.where('is_deleted', false).where('is_published', true)
  }

  public async publish(video: Video) {
    const requiredToPublish = [
      'title',
      'code',
      'coverFileId',
      'releaseDate',
      'duration',
      'imageFileId',
      'directorId',
      'makerId',
    ]
    const missing = requiredToPublish.filter((field) => !video[field])
    if (missing.length) return false

    video.isPublished = true
    await video.save()
  }
}
