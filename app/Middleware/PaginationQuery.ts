import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class PaginationQuery {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    const { page, limit } = request.qs()

    request.pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : Env.get('PAGINATION_ITEM_PER_PAGE', 10),
    }

    await next()
  }
}
