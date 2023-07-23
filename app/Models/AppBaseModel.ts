import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

export default class AppBaseModel extends compose(BaseModel, SoftDeletes) {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uid: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null

  @beforeCreate()
  public static async generateUid(model: AppBaseModel) {
    model.uid = uniqid()
  }
}
