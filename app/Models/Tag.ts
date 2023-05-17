import { DateTime } from 'luxon'
import slugify from 'limax'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'

export default class Tag extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column({ serializeAs: null })
  public description: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

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
