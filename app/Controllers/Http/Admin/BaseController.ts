import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseRepository, { IQueries } from 'App/Repositories/BaseRepository'

export default class BaseController {
  public name: string

  constructor(private readonly repository: BaseRepository) {}

  public async index({ request, response }: HttpContextContract) {
    const { filter, sort, range } = request.qs()

    const queries: IQueries = {
      filter: filter ? JSON.parse(filter) : {},
      sort: sort ? JSON.parse(sort) : {},
      range: range ? JSON.parse(range) : [0, 10],
    }

    const results = await this.repository.getList(queries)

    const from = results.perPage * (results.currentPage - 1)
    const to = from + results.perPage
    const total = results.total

    response.header('Content-Range', `${this.name} ${from}-${to}/${total}`)
    response.header('Access-Control-Expose-Headers', 'Content-Range')

    const json = results.toJSON()

    return response.json(json.data)
  }
}
