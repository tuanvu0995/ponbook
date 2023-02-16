import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import slugify from 'App/utils/slugify'
import { nanoid } from 'nanoid'

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'created_by',
  })
  public createdBy: BelongsTo<typeof User>

  @beforeCreate()
  public static async generateUid(page: Page) {
    page.uid = nanoid()
  }

  @beforeSave()
  public static async generateSlug(page: Page) {
    if (page.title) {
      page.slug = slugify(page.title)
    }
  }
}
