import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NotFoundException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NotFoundException extends Exception {
  private isApi: boolean = false

  constructor(message: string, isApi: boolean = false) {
    super(message, 404, 'E_NOT_FOUND')
    this.isApi = isApi
  }

  public async handle(error: this, ctx: HttpContextContract) {
    if (this.isApi) {
      return ctx.view.render('errors/not-found')
    }
    ctx.response.status(error.status).send(error.message)
  }
}
