import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import {
  afterCreate,
  afterSave,
  BaseModel,
  beforeCreate,
  beforeFind,
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
import Torrent from './Torrent'
import File from './File'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUID(video: Video) {
    video.uid = uniqid()
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

  @hasMany(() => Torrent)
  public torrents: HasMany<typeof Torrent>

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
    Event.emit('video:created', video)
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
        const castModel = await Cast.firstOrCreate({ name: cast }, { name: cast })
        return castModel.id
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
}
