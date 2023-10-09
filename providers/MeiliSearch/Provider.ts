import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import MeiliSearchService from './MeiliSearch'

export default class MeiliSearchProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    this.app.container.singleton('MeiliSearch', () => {
      return new MeiliSearchService()
    })
  }

  public async boot() {}

  public async ready() {}

  public async shutdown() {}
}
