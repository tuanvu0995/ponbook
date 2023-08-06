import { beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import generateUid from 'App/Helpers/generateUid'
import User from './User'
import Permission from './Permission'
import AppBaseModel from './AppBaseModel'

export default class Role extends AppBaseModel {
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
