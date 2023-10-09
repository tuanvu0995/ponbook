import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

type ViewRange = 'day' | 'week' | 'month' | 'year'

export default class View extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public refererType: string

  @column()
  public refererId: number

  @column()
  public count: number

  @column()
  public range: ViewRange

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async increment(refererType: string, refererId: number) {
    const view = await View.query()
      .where('referer_type', refererType)
      .where('referer_id', refererId)
      .where('range', 'day')
      .first()

    if (!view) {
      return await View.create({
        refererType,
        refererId,
        count: 1,
        range: 'day',
      })
    }

    view.count++
    await view.save()
    return view
  }
}
