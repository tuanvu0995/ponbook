import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'

export default class Torrent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public videoId: number

  @column()
  public name: string

  @column()
  public magnetUrl: string

  @column()
  public torrentFile: string

  @column()
  public seed: number

  @column()
  public leech: number

  @column()
  public completed: number

  @column()
  public infoHash: string

  @column()
  public size: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(torrent: Torrent) {
    torrent.uid = nanoid()
  }
}
