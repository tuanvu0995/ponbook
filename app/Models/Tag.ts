import slugify from 'limax'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

export default class Tag extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null

  @manyToMany(() => Video, {
    pivotTable: 'video_tags',
  })
  public videos: ManyToMany<typeof Video>

  @beforeCreate()
  public static async generateSlug(tag: Tag) {
    tag.slug = slugify(tag.name)
  }

  public static async getRandomTags() {
    const tags = await this.query().orderByRaw('RAND()').limit(10).preload('videos')
    return tags
  }
}
