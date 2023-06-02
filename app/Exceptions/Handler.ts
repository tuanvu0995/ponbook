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

import _ from 'lodash'
import Logger from '@ioc:Adonis/Core/Logger'
import Sentry from '@ioc:Adonis/Addons/Sentry'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '403': 'errors/unauthorized',
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }
  protected ignoreCodes = ['E_ROUTE_NOT_FOUND', 'E_RESOURCE_NOT_FOUND', 'E_VALIDATION_FAILURE']
  protected ignoreStatuses = [404, 422, 403, 401]

  constructor() {
    super(Logger)
  }

  protected context(ctx: HttpContextContract) {
    return {
      userId: ctx.auth.user?.id,
      url: ctx.request.url(),
      body: ctx.request.body(),
    }
  }

  public async report(error: any, ctx) {
    if (!this.shouldReport(error)) {
      return
    }

    if (typeof error.report === 'function') {
      Sentry.captureException(error, ctx)
      error.report(error, ctx)
      return
    }

    Sentry.captureException(error, ctx)
  }

  public async handle(error, ctx) {
    if (ctx.request.accepts(['html', 'application/json']) === 'application/json') {
      return ctx.response.status(error.status).json({
        message: error.message,
      })
    }

    return super.handle(error, ctx)
  }
}
