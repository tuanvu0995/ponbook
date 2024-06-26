import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import Turnstile from '@ioc:Turnstile'

/**
 * Please register this middleware inside `start/kernel.ts` file under the list
 * of named middleware
 */

export default class TurnstileMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    try {
      ctx.turnstile = await Turnstile.check(ctx)
    } catch (error) {
      throw new Exception('invalid-input-response', 400, 'E_TURNSTILE')
    }

    await next()
  }
}
