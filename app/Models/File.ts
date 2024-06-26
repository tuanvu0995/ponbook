import { beforeCreate, column, computed } from '@ioc:Adonis/Lucid/Orm'
import AppBaseModel from './AppBaseModel'

export default class File extends AppBaseModel {
  @column()
  public name: string

  @column({ serializeAs: null })
  public type: string

  @column()
  public path: string

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

  @computed()
  public get thumbnailStyle(): string {
    if (this.width > this.height) {
      return `width: 100%; height: auto;`
    }
    return `height: 100%; width: auto;`
  }

  @computed()
  public get aspectRatioY(): number {
    return this.height / this.width
  }

  @beforeCreate()
  public static initTypeMimeType(file: File) {
    file.type = 'image/webp'
  }

  @beforeCreate()
  public static upsetFileName(file: File) {
    if (!file.name) {
      file.name = file.path.split('/').pop() || 'noname'
    }
  }
}
