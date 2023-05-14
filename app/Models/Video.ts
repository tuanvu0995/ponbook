import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import {
  afterCreate,
  afterSave,
  BaseModel,
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
import FileService from 'App/Services/FileService'
import slugify from 'App/utils/slugify'

export default class Video extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uid: string

  @column()
  public userId: number

  @column()
  public code: string

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public cover: string

  @column()
  public coverFileId: number

  @column()
  public image: string

  @column()
  public imageFileId: number

  @column()
  public imageUrls?: string[]

  @column()
  public video: string

  @column()
  public directorId: number

  @column()
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

  @column()
  public isDraft: boolean

  @column()
  public isPublished: boolean

  @column()
  public isDeleted: boolean

  @column()
  public hasTorrent: boolean

  @column()
  public version: number

  @column()
  public updatedBy: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUID(video: Video) {
    video.uid = uniqid()
  }

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
  public videoCover: BelongsTo<typeof File>

  @belongsTo(() => File, {
    foreignKey: 'imageFileId',
  })
  public videoImage: BelongsTo<typeof File>

  @manyToMany(() => File, {
    pivotTable: 'video_files',
  })
  public images: ManyToMany<typeof File>

  @beforeFind()
  public static where(query: ModelQueryBuilderContract<typeof Video>) {
    query.where('is_deleted', false)
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

  public async saveImages(video: Video, images: string[]) {
    const imageIds = await Promise.all([
      ...images.map(async (image) => {
        const file = await FileService.processImageFromUrl(image, 'image')
        return file.id
      }),
    ])

    await video.related('images').sync(imageIds)
  }

  public async saveCover(video: Video, cover: string) {
    const file = await FileService.processImageFromUrl(cover, 'cover')
    video.coverFileId = file.id
    await video.save()
  }

  public async saveImage(video: Video, image: string) {
    const file = await FileService.processImageFromUrl(image, 'image')
    video.imageFileId = file.id
    await video.save()
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
