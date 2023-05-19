import { DateTime } from 'luxon'
import uniqid from 'uniqid'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'
import Role from './Role'
import Video from './Video'
import Comment from './Comment'

export default class User extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uid: string

  @column({ serializeAs: null })
  public email: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column()
  public firstName?: string

  @column()
  public lastName?: string

  @column()
  public bio?: string

  @column({ serializeAs: null })
  public birthday?: string

  @column()
  public gender?: String

  @column({ serializeAs: null })
  public superUser: boolean

  @column({ serializeAs: null })
  public type: string

  @column({ serializeAs: null })
  public accountStatus: string

  @column({ serializeAs: null })
  public isDeleted: false

  @column({ serializeAs: null })
  public socialProvider?: string

  @column({ serializeAs: null })
  public socialId?: string

  @column({ serializeAs: null })
  public socialToken?: string

  @column({ serializeAs: null })
  public isSocialActive: boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(User: User) {
    if (User.$dirty.password) {
      User.password = await Hash.make(User.password)
    }
  }

  @beforeCreate()
  public static async generateUID(User: User) {
    User.uid = uniqid()
  }

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
    pivotTimestamps: true,
  })
  public roles: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTable: 'user_permissions',
    pivotTimestamps: true,
  })
  public permissions: ManyToMany<typeof Permission>

  @manyToMany(() => Video, {
    pivotTable: 'favorite_videos',
  })
  public favorites: ManyToMany<typeof Video>

  @manyToMany(() => Comment, {
    pivotTable: 'votes',
  })
  public votedComments: ManyToMany<typeof Comment>

  public async hasPermission(permission: string): Promise<boolean> {
    const result = await Permission.query()
      .innerJoin('user_permissions', 'permissions.id', 'user_permissions.permission_id')
      .where('user_permissions.user_id', this.id)
      .where('permissions.full_action', permission)
      .where('user_permissions.allow', true)
      .where('permissions.is_deleted', false)
      .first()
    return result ? true : false
  }
}
