import { beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import generateUid from 'App/Helpers/generateUid'
import AppBaseModel from './AppBaseModel'

export default class Maker extends AppBaseModel {
  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public productCount: number

  @hasMany(() => Video)
  public videos: HasMany<typeof Video>

  @beforeCreate()
  public static async generateUID(maker: Maker) {
    maker.uid = generateUid()
  }
}
