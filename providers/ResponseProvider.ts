import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class ResponseProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // All bindings are ready, feel free to use them
    const Response = this.app.container.use('Adonis/Core/Response')
    const Event = this.app.container.use('Adonis/Core/Event')
    Response.macro('endResponse', function (body?: any, statusCode?: number) {
      this.flushHeaders(statusCode)

      // avoid ArgumentsAdaptorTrampoline from V8 (inspired by fastify)
      const res = this.response as any
      res.end(body, null, null)
      Event.emit('request:responded', this.ctx!)
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
