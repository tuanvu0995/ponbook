import { column } from '@ioc:Adonis/Lucid/Orm'
import AppBaseModel from './AppBaseModel'

export default class Permission extends AppBaseModel {
  @column()
  public name: string

  @column()
  public resource: string

  @column()
  public scope: string

  @column()
  public action: string

  @column()
  public fullAction: string

  @column()
  public isDeleted: boolean
}
