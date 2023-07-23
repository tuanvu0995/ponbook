import { column } from '@ioc:Adonis/Lucid/Orm'
import AppBaseModel from './AppBaseModel'

export enum ContactStatus {
  Pending = 'pending',
  Replied = 'replied',
  Closed = 'closed',
  Blocked = 'blocked',
}

export default class Contact extends AppBaseModel {
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
}
