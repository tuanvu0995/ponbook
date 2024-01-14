import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { HttpRequestPagination } from '@ioc:Contracts'
import { SortType } from 'App/common/types'

export default class PaginationQuery {
  public async handle(ctx: HttpContextContract & HttpRequestPagination, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const { page, limit, sort = '', filter = '' } = ctx.request.qs()
    ctx.pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : parseInt(Env.get('PAGINATION_LIMIT', '36')),
      sorts: {},
      filters: {},
    }

    if (sort) {
      const sortList = Array.isArray(sort) ? sort : [sort]
      const sortArr = sortList[sortList.length - 1].split(':')
      ctx.pagination.sorts = { [sortArr[0]]: sortArr[1] as SortType }
    }

    if (filter) {
      const filterArr = Array.isArray(filter) ? filter : [filter]
      filterArr.forEach((item) => {
        const filterItem = item.split(':')
        ctx.pagination.filters[filterItem[0]] = ['yes', 'no'].includes(filterItem[1])
          ? filterItem[1] === 'yes'
          : filterItem[1]
      })
    }

    await next()
  }
}
