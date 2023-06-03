import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import TurnstileService from 'App/Services/TurnstileService'

export default class Turnstile {
  public async handle(context: HttpContextContract, next: () => Promise<void>, type?: string) {
    console.log('Turnstile middleware', type)
    // code for middleware goes here. ABOVE THE NEXT CALL
    const turnstile = new TurnstileService(context)
    if (await turnstile.check()) {
      return await next()
    }

    if (_.includes(type, 'web')) {
      context.session.flash('error', 'Your request has been flagged as suspicious.')
      return context.response.redirect().back()
    } else {
      throw new BadRequestException('Your request has been flagged as suspicious.')
    }
  }
}
