import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { PaginatedFilters, PaginatedSorts, SortType } from 'App/common/types'
import { DateTime } from 'luxon'

const defaultSorts = (sort: string): SortType => {
  return sort === 'asc' ? 'asc' : 'desc'
}

export default class DatabaseProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // All bindings are ready, feel free to use them

    const { ModelQueryBuilder } = this.app.container.use('Adonis/Lucid/Database')

    ModelQueryBuilder.macro(
      'filterWithPaginate',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      async function (
        page: number,
        limit: number,
        filters?: PaginatedFilters,
        sorts?: PaginatedSorts
      ) {
        if (filters?.singleActress) {
          this.has('casts', '=', 1)
        }

        if (sorts) {
          if (sorts.releaseDate) {
            this.orderBy('release_date', defaultSorts(sorts.releaseDate))
          }
          if (sorts.updatedAt) {
            this.orderBy('updated_at', defaultSorts(sorts.updatedAt))
          }
          if (sorts.createdAt) {
            this.orderBy('created_at', defaultSorts(sorts.createdAt))
          }
          if (sorts.code) {
            this.orderBy('code', defaultSorts(sorts.code))
          }
          if (sorts.views) {
            this.leftJoin('views', 'videos.id', 'views.referer_id').orderBy(
              'views.count',
              defaultSorts(sorts.views)
            )
          }
          if (sorts.viewsInDay) {
            const lastDay = DateTime.now().minus({ days: 1 }).toSQL()
            this.leftJoin('views', 'videos.id', 'views.referer_id')
              .where('views.range', 'day')
              .where('views.created_at', '>=', lastDay)
              .orderBy('views.count', defaultSorts(sorts.viewsInDay))
          }
          if (sorts.viewsInWeek) {
            const lastWeek = DateTime.now().minus({ weeks: 1 }).toSQL()
            this.leftJoin('views', 'videos.id', 'views.referer_id')
              .where('views.range', 'week')
              .orWhere('views.range', 'day')
              .where('views.created_at', '>=', lastWeek)
              .orderBy('views.count', defaultSorts(sorts.viewsInWeek))
          }
          if (sorts.viewsInMonth) {
            const lastMonth = DateTime.now().minus({ months: 1 }).toSQL()
            this.leftJoin('views', 'videos.id', 'views.referer_id')
              .where('views.range', 'month')
              .orWhere('views.range', 'day')
              .where('views.created_at', '>=', lastMonth)
              .orderBy('views.count', defaultSorts(sorts.viewsInMonth))
          }
        } else {
          this.orderBy('release_date', 'desc')
        }

        return await this.paginate(page, limit)
      }
    )
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
