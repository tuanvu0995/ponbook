import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const View = await this.app.container.use('Adonis/Core/View')
    View.global('dateFromNow', (value: DateTime) => {
      return value.toRelative()
    })
    View.global('imageUrl', (imageName: string) => {
      let name = (imageName || '').split('.').slice(0, -1).join('.') + '.webp'
      if (name.startsWith('/uploads')) {
        name = name.replace('/uploads', '')
      }
      return `/uploads${name}`
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
