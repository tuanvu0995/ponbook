import slugify from 'limax'
import { beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import AppBaseModel from './AppBaseModel'

export default class Tag extends AppBaseModel {
  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

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
