import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'

export default class Visitor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public ipAddress: string

  @column()
  public userAgent: string

  @column()
  public method: string

  @column()
  public headers: string

  @column()
  public path: string

  @column()
  public count: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(visitor: Visitor) {
    visitor.uid = nanoid()
  }
}
