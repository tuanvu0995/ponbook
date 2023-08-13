import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class AppAuth {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    const appAuthKey = request.header('x-ponbook-app-key')?.trim()
    if (appAuthKey !== Env.get('PB_APP_KEY')) {
      throw new BadRequestException('Invalid app key')
    }

    await next()
  }
}
