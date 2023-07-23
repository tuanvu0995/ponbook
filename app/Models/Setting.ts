import { column } from '@ioc:Adonis/Lucid/Orm'
import AppBaseModel from './AppBaseModel'

export default class Setting extends AppBaseModel {
  @column()
  public key: string

  @column()
  public type: string

  @column()
  public value: string
}
