import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum ContactStatus {
  Pending = 'pending',
  Replied = 'replied',
  Closed = 'closed',
  Blocked = 'blocked',
}

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
