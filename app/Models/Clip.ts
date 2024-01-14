import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, beforeCreate, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Label from './Label'
import generateUid from 'App/Helpers/generateUid'

export default class Clip extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public caption: string

  @column()
  public path: string

  @column()
  public views: number

  @column()
  public likes: number

  @column()
  public comments: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Label)
  public labels: ManyToMany<typeof Label>

  @beforeCreate()
  public static async generateUid(clip: Clip) {
   clip.uid = generateUid()
  }
}
