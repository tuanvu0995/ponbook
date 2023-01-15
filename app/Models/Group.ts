import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import generateUid from 'App/utils/generateUid'
import User from './User'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public policies: string

  @column()
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUID(group: Group) {
    group.uid = generateUid()
  }

  @manyToMany(() => User, {
    pivotTable: 'user_groups',
  })
  public users: ManyToMany<typeof User>
}
