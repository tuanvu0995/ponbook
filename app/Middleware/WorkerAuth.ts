import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class BotAuth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const token = request.header('x-pb-worker-key')?.trim()
    if (token !== Env.get('BOT_TOKEN')) {
      return response.badRequest('Invalid token')
    }

    await next()
  }
}
