import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export type PointType = 'comment' | 'upVote' | 'downVote'

export default class Point extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public userId: number

  @column()
  public amount: number

  @column()
  public totalPoints: number

  @column()
  public originPoints: number

  @column()
  public description: string

  @column()
  public type: PointType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(point: Point) {
    point.uid = uniqid()
  }
}
