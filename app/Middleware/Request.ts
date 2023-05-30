import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'

export default class Request {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    Event.emit('request:received', ctx)
    await next()
  }
}
