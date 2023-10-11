import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  afterCreate,
  beforeCreate,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Event from '@ioc:Adonis/Core/Event'
import User from './User'

type NotificationType = 'comment' | 'like' | 'follow' | 'mention' | 'message'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public type: NotificationType

  @column()
  public title: string

  @column()
  public content: string

  @column({
    serialize: (value: string) => {
      if (value && typeof value === 'string') return JSON.parse(value)
      return value
    },
    prepare: (value: any) => {
      return value && typeof value == 'string' ? JSON.stringify(value) : value
    },
  })
  public data: any

  @column()
  public link?: string

  @column()
  public read: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeCreate()
  public static async setDefaultRead(notification: Notification) {
    notification.read = false
  }

  @afterCreate()
  public static async sendNotificationEvent(notification: Notification) {
    Event.emit('notification:created', notification)
  }
}
