import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export enum SubscriptionPlans {
  FREE = 'FREE',
}

export enum SubscriptionChannels {
  EMAIL = 'EMAIL',
  TELEGRAM = 'TELEGRAM',
}

export enum SubscriptionEvents {
  NEW_RELEASE = 'NEW_RELEASE',
  NEW_VIDEO = 'NEW_VIDEO',
  NEW_COMMENT = 'NEW_COMMENT',
}

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public userId: number

  @column()
  public email: string

  @column()
  public telegramChatId: string

  @column()
  public event: SubscriptionEvents

  @column()
  public channel: SubscriptionChannels

  @column()
  public plan: SubscriptionPlans

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(subscription: Subscription) {
    subscription.uid = uniqid()
  }
}
