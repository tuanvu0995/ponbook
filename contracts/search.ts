declare module '@ioc:MeiliSearch' {
  import { SearchParams } from 'meilisearch'

  interface MeiliSearchServiceContract {
    updateFilterableAttributes(name: string, fields: string[]): Promise<void>
    index(name: string, documents: any[]): Promise<void>
    search(name: string, keyword: string, parameters?: SearchParams): Promise<any>
  }

  const MeiliSearchService: MeiliSearchServiceContract

  export default MeiliSearchService
}
