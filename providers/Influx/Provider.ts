import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class MeiliSearchProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    this.app.container.singleton('Influx', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return new (require('./Influx').default)()
    })
  }

  public async boot() {
    // const MeiliSearch = this.app.container.resolveBinding('MeiliSearch')
    // await MeiliSearch.updateFilterableAttributes('videos', ['code', 'title', 'casts', 'tags'])
  }

  public async ready() {}

  public async shutdown() {
    // Cleanup, since app is going down
    const Influx = this.app.container.resolveBinding('Influx')
    await Influx.close()
  }
}
