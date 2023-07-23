import { beforeCreate, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import slugify from 'App/Utils/slugify'
import generateUid from 'App/Utils/generateUid'
import AppBaseModel from './AppBaseModel'

export default class Page extends AppBaseModel {
  @column()
  public uid: string

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public content: string

  @column()
  public isPublished: boolean

  @column()
  public layout: string

  @belongsTo(() => User, {
    foreignKey: 'created_by',
  })
  public createdBy: BelongsTo<typeof User>

  @beforeCreate()
  public static async generateUid(page: Page) {
    page.uid = generateUid()
  }

  @beforeSave()
  public static async generateSlug(page: Page) {
    if (page.title) {
      page.slug = slugify(page.title)
    }
  }
}
