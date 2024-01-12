import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { PaginatedFilters, PaginatedSorts } from 'App/common/types'

const sortMapping: { [key: string]: string } = {
  code: 'code',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  releaseDate: 'release_date',
  views: 'views',
  viewsInDay: 'views_in_day',
  viewsInWeek: 'views_in_week',
  viewsInMonth: 'views_in_month',
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
      async function (
        filters: PaginatedFilters,
        sorts: PaginatedSorts,
        page: number,
        limit: number
      ) {
        if (filters?.singleActress) {
          this.has('casts', '=', 1)
        }

        if (sorts) {
          Object.keys(sorts).forEach((key) => {
            const sortKey = sortMapping[key]
            if (sortKey) {
              this.orderBy(sortKey, sorts[key])
            }
          })
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
