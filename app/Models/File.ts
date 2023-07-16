import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import Drive from '@ioc:Adonis/Core/Drive'
import { BaseModel, beforeCreate, beforeDelete, column } from '@ioc:Adonis/Lucid/Orm'
import retry from 'App/Utils/retry'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public path: string

  @column()
  public thumbnailPath: string

  @column()
  public size: number

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
  public static initTypeMimeType(file: File) {
    file.type = 'image/webp'
  }

  @beforeDelete()
  public static async deleteFile(file: File) {
    await retry(
      async () => {
        await Drive.use('s3').delete(file.path)
        console.log('Successfully deleted file', file.path)
      },
      {
        retriesCount: 3,
        delay: 1000,
      }
    )
  }
}
