import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SearchTerm extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public term: string

  @column()
  public totalResults: number

  @column()
  public count: number

  @column()
  public lastDayCount: number

  @column()
  public lastWeekCount: number

  @column()
  public lastMonthCount: number

  @column()
  public lastYearCount: number

  @column()
  public isHidden: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt?: DateTime
}
