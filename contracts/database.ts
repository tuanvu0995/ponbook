declare module '@ioc:Adonis/Lucid/Orm' {
  import { LucidModel, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
  import { PaginatedFilters, PaginatedSorts } from 'App/common/types'
  interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result extends LucidRow = InstanceType<Model>
  > {
    filterWithPaginate(
      page: number,
      limit: number,
      filters?: PaginatedFilters,
      sort?: PaginatedSorts
    ): Promise<ModelPaginatorContract<Result>>
  }
}
