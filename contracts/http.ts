declare module '@ioc:Contracts' {
  import { PaginatedFilters, PaginatedSorts } from 'App/common/types'
  export interface PaginationQuery {
    page: number
    limit: number
    sorts: PaginatedSorts
    filters: PaginatedFilters
  }

  export interface HttpRequestPagination {
    pagination: PaginationQuery
  }
}
