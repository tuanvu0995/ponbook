import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public path: string

  @column()
  public thumbnailPath: string

  @column()
  public size: number

  @column()
  public mime_type: string

  @column()
  public extension: string

  @column()
  public width: number

  @column()
  public height: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(file: File) {
    file.uid = uniqid()
  }

  @beforeCreate()
  public static initMimeType(file: File) {
    file.mime_type = 'image/webp'
  }
}
