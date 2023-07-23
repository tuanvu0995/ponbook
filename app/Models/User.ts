import _ from 'lodash'
import uniqid from 'uniqid'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  beforeCreate,
  manyToMany,
  ManyToMany,
  computed,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'
import Role from './Role'
import Video from './Video'
import Comment from './Comment'
import Box from './Box'
import AppBaseModel from './AppBaseModel'

export default class User extends AppBaseModel {
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

  @column({ serializeAs: null })
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

  @computed()
  public get fullName() {
    return _.chain([this.firstName, this.lastName]).filter(_.isString).join(' ').value()
  }

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
  public favoriteVideos: ManyToMany<typeof Video>

  @manyToMany(() => Comment, {
    pivotTable: 'votes',
  })
  public votedComments: ManyToMany<typeof Comment>

  @hasMany(() => Box)
  public boxes: HasMany<typeof Box>

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
