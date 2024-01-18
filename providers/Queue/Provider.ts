import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class QueueProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Queue', () => {
      const config = this.app.container.resolveBinding('Adonis/Core/Config').get('queue').config
      const logger = this.app.container.resolveBinding('Adonis/Core/Logger')
      const application = this.app.container.resolveBinding('Adonis/Core/Application')

      return {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        Queue: new (require('./Queue').default)(config, logger, application),
      }
    })
  }
}
