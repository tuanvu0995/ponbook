import { MeiliSearch, SearchParams, SearchResponse } from 'meilisearch'
import Env from '@ioc:Adonis/Core/Env'

export default class MeiliSearchService {
  private client: MeiliSearch

  constructor() {
    this.client = new MeiliSearch({
      host: Env.get('MEILI_HOST'),
      apiKey: Env.get('MEILI_API_KEY'),
    })
  }

  public async updateFilterableAttributes(name: string, fields: string[]) {
    const index = await this.client.getIndex(name)
    await index.updateFilterableAttributes(fields)
  }

  public async index(name: string, documents: any[]) {
    const index = await this.client.getIndex(name)
    const response = await index.addDocuments(documents)
    return response
  }

  public async search(
    name: string,
    keyword: string,
    parameters?: SearchParams
  ): Promise<SearchResponse<Record<string, any>, SearchParams>> {
    const index = await this.client.getIndex(name)
    const response = await index.search(keyword, parameters)
    return response
  }
}
