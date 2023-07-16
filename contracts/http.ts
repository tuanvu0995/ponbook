declare module '@ioc:Contracts' {
  export interface PaginationQuery {
    page: number
    limit: number
  }
  export interface HttpRequestPagination {
    pagination: PaginationQuery
  }
}
