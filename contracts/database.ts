declare module '@ioc:Adonis/Lucid/Orm' {
  import { LucidModel, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
  import { PaginatedFilters, PaginatedSorts } from 'App/common/types'
  interface ModelQueryBuilderContract<Model extends LucidModel, Result extends LucidRow = InstanceType<Model>> {
    filterWithPaginate(
      filters: PaginatedFilters,
      sort: PaginatedSorts,
      page: number,
      limit: number
    ): Promise<ModelPaginatorContract<Result>>
  }
}
