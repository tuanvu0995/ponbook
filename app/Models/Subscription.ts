import uniqid from 'uniqid'
import { beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import AppBaseModel from './AppBaseModel'

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

export default class Subscription extends AppBaseModel {
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
  public metadata: string

  @column()
  public isActive: boolean

  @beforeCreate()
  public static async generateUid(subscription: Subscription) {
    subscription.uid = uniqid()
  }
}
