import uniqid from 'uniqid'
import Drive from '@ioc:Adonis/Core/Drive'
import { beforeCreate, beforeDelete, column, computed } from '@ioc:Adonis/Lucid/Orm'
import retry from 'App/Utils/retry'
import AppBaseModel from './AppBaseModel'
import Logger from '@ioc:Adonis/Core/Logger'

export default class File extends AppBaseModel {
  @column()
  public uid: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public type: string

  @column()
  public path: string

  @column()
  public thumbnailPath: string

  @column({ serializeAs: null })
  public size: number

  @column({ serializeAs: null })
  public extension: string

  @column()
  public width: number

  @column()
  public height: number

  @column()
  public data: string

  @computed()
  public get dataUrl(): string {
    return `data:${this.type};base64,${this.data}`
  }

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
        Logger.info(
          'Successfully deleted file',
          JSON.stringify({
            uid: file.uid,
            filePath: file.path,
          })
        )
      },
      {
        retriesCount: 3,
        delay: 1000,
      }
    )
  }
}
