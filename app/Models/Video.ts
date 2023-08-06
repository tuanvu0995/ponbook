import {
  afterCreate,
  afterSave,
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
import Event from '@ioc:Adonis/Core/Event'
import Cast from './Cast'
import Director from './Director'
import Maker from './Maker'
import User from './User'
import Tag from './Tag'
import Comment from './Comment'
import File from './File'
import slugify from 'App/Helpers/slugify'
import AppBaseModel from './AppBaseModel'

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

  @beforeFind()
  public static where(query: ModelQueryBuilderContract<typeof Video>) {
    query.where('is_deleted', false).where('is_published', true)
  }

  @afterCreate()
  public static async emitCreatedEvent(video: Video) {
    Event.emit('video:created', video)
  }

  @afterSave()
  public static async emitUpdatedEvent(video: Video) {
    Event.emit('video:updated', video)
  }

  public async saveTags(video: Video, tags: string[]) {
    const tagIds = await Promise.all(
      tags.map(async (tag) => {
        const tagModel = await Tag.firstOrCreate({ name: tag }, { name: tag })
        return tagModel.id
      })
    )
    await video.related('tags').sync(tagIds)
  }

  public async saveCasts(video: Video, casts: string[]) {
    const castIds = await Promise.all(
      casts.map(async (cast) => {
        const existsCast = await Cast.getCastByName(cast)
        if (existsCast) {
          return existsCast.id
        } else {
          const castModel = await Cast.create({ name: cast })
          return castModel.id
        }
      })
    )
    await video.related('casts').sync(castIds)
  }

  public async saveDirector(video: Video, director: string) {
    let d = await Director.query().where('name', director).first()
    if (!d) {
      d = new Director()
      d.name = director
      await d.save()
    }
    video.directorId = d.id
  }

  public async saveMaker(video: Video, maker: string) {
    let m = await Maker.query().where('name', maker).first()
    if (!m) {
      m = new Maker()
      m.name = maker
      await m.save()
    }
    video.makerId = m.id
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
