import uniqid from 'uniqid'
import { beforeCreate, column, computed } from '@ioc:Adonis/Lucid/Orm'
import AppBaseModel from './AppBaseModel'

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

  @column({ serializeAs: null })
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
}
