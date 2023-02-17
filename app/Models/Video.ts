import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Drive from '@ioc:Adonis/Core/Drive'
import { nanoid } from 'nanoid'
import Cast from './Cast'
import Director from './Director'
import Maker from './Maker'
import User from './User'
import Tag from './Tag'
import Comment from './Comment'
import Torrent from './Torrent'

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
  public image: string

  @column({
    serializeAs: null,
  })
  public images: string

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUID(video: Video) {
    video.uid = nanoid()
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

  @computed()
  public get imageGalleries() {
    return JSON.parse(this.images || '[]')
  }

  @beforeFind()
  public static where(query: ModelQueryBuilderContract<typeof Video>) {
    query.where('is_deleted', false)
  }

  public async preloadImages({ includeGalleries = false } = {}) {
    if (this.image) {
      const mainImageUrl = await Drive.getUrl(this.image)

      this.image = mainImageUrl
    }

    if (includeGalleries) {
      const images = await Promise.all(this.imageGalleries.map((image) => Drive.getUrl(image)))
      this.imageUrls = images.map((image) => image)
    }
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
