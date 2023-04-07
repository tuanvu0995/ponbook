import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { OrderByValues } from 'Config/contants'

export interface IQueries {
  sort: string[]
  range: number[]
  filter: { [key: string]: string }
}

export default class BaseRepository {
  constructor(private readonly model: typeof BaseModel) {}

  public async getList(queries: IQueries) {
    const { sort, range, filter } = queries
    const query = this.model.query()
    if (filter) {
      for (const [key, value] of Object.entries(queries.filter)) {
        query.where(key, value)
      }
    }

    if (sort) {
      const [key, value] = sort
      query.orderBy(key, value as OrderByValues)
    } else {
      query.orderBy('id', 'desc')
    }

    if (range) {
      const page = Math.floor(range[0] / range[1]) + 1
      const perPage = range[1] - range[0]
      return await query.paginate(page, perPage)
    }
    return await query.paginate(1, 10)
  }
}
