import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import generateUid from 'App/utils/generateUid'
import User from './User'
import Permission from './Permission'

export default class Role extends BaseModel {
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
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUID(role: Role) {
    role.uid = generateUid()
  }

  @manyToMany(() => User, {
    pivotTable: 'user_roles',
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
    pivotTimestamps: true,
  })
  public permissions: ManyToMany<typeof Permission>
}
