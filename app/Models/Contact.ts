import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'

export enum ContactStatus {
  Pending = 'pending',
  Replied = 'replied',
  Closed = 'closed',
  Blocked = 'blocked',
}

export default class Contact extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public subject: string

  @column()
  public message: string

  @column()
  public status: ContactStatus

  @column()
  public ipAddress: string

  @column()
  public userAgent: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null
}
