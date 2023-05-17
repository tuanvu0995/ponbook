import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import Drive from '@ioc:Adonis/Core/Drive'
import { BaseModel, beforeCreate, beforeDelete, column, computed } from '@ioc:Adonis/Lucid/Orm'
import retry from 'App/utils/retry'
import Env from '@ioc:Adonis/Core/Env'

export default class File extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: null })
  public uid: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public type: string

  @column({ serializeAs: null })
  public path: string

  @column({ serializeAs: null })
  public thumbnailPath: string

  @column({ serializeAs: null })
  public size: number

  @column({ serializeAs: null })
  public extension: string

  @column()
  public width: number

  @column()
  public height: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @computed()
  public get imageUrl() {
    if (!this.path) return null
    return `${Env.get('CDN_URL')}/${this.path}`
  }

  @computed()
  public get thumbnailUrl() {
    if (!this.thumbnailPath) return null
    return `${Env.get('CDN_URL')}/${this.thumbnailPath}`
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
        console.log('Successfully deleted file', file.path)
      },
      {
        retriesCount: 3,
        delay: 1000,
      }
    )
  }
}
