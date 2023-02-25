import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'
import DeviceDetector from 'device-detector-js'

export default class Visitor extends BaseModel {
  private static deviceDetector = new DeviceDetector()

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

  @column()
  public isBot: boolean

  @column()
  public country: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(visitor: Visitor) {
    visitor.uid = nanoid()
  }

  @beforeSave()
  public static async checkIsBot(visitor: Visitor) {
    const { bot } = this.deviceDetector.parse(visitor.userAgent)
    if (bot) visitor.isBot = true
  }
}
