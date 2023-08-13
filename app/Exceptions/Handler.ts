/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import Sentry from '@ioc:Adonis/Addons/Sentry'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected ignoreCodes = ['E_ROUTE_NOT_FOUND', 'E_RESOURCE_NOT_FOUND', 'E_VALIDATION_FAILURE']
  protected ignoreStatuses = [404, 422, 403, 401]

  constructor() {
    super(Logger)
  }

  protected context(ctx: HttpContextContract) {
    return {
      userId: ctx.auth.user?.id,
      userEmail: ctx.auth.user?.email,
      requestId: ctx.request.id(),
      url: ctx.request.url(),
      method: ctx.request.method(),
      headers: ctx.request.headers(),
    }
  }

  public async handle(error, ctx) {
    Sentry.captureException(error, ctx)

    /**
     * Self handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).json(error.messages)
    }

    const statusCode = error.status || 500
    const message = error.message || 'Something went wrong. Please try again later.'

    return ctx.response.status(statusCode).json({
      error: {
        code: error.code,
        message,
      },
    })
  }
}
