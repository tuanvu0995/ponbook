import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { HttpRequestPagination } from '@ioc:Contracts'

export default class PaginationQuery {
  public async handle(ctx: HttpContextContract & HttpRequestPagination, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const { page, limit } = ctx.request.qs()
    ctx.pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : Env.get('PAGINATION_ITEM_PER_PAGE', 10),
    }

    await next()
  }
}
