import { beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import generateUid from 'App/Utils/generateUid'
import AppBaseModel from './AppBaseModel'

export default class Director extends AppBaseModel {
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
  public static async generateUID(director: Director) {
    director.uid = generateUid()
  }
}
