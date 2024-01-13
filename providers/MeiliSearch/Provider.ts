import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class MeiliSearchProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    this.app.container.singleton('MeiliSearch', () => {
      return new (require('./MeiliSearch').default)()
    })
  }

  public async boot() {
    // const MeiliSearch = this.app.container.resolveBinding('MeiliSearch')
    // await MeiliSearch.updateFilterableAttributes('videos', ['code', 'title', 'casts', 'tags'])
  }

  public async ready() {}

  public async shutdown() {}
}
