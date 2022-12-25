import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
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

  @column()
  public birthday?: string

  @column()
  public gender?: String

  @column({ serializeAs: null })
  public superUser: boolean

  @column({ serializeAs: null })
  public type: string

  @column()
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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(User: User) {
    if (User.$dirty.password) {
      User.password = await Hash.make(User.password)
    }
  }

  @beforeCreate()
  public static async generateUID(User: User) {
    User.uid = nanoid()
  }
}
