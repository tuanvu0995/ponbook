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
import { CaptureContext, Severity } from '@sentry/types'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected ignoreCodes = ['E_ROUTE_NOT_FOUND', 'E_RESOURCE_NOT_FOUND', 'E_VALIDATION_FAILURE']
  protected ignoreStatuses = [404, 422, 403, 401, 400]

  constructor() {
    super(Logger)
  }

  protected context(ctx: HttpContextContract) {
    return {
      requestId: ctx.request.id(),
      url: ctx.request.url(),
      method: ctx.request.method(),
      headers: ctx.request.headers(),
      body: ctx.request.body(),
      query: ctx.request.qs(),
    }
  }

  public report(error: this, ctx: HttpContextContract) {
    if (!this.shouldReport(error)) {
      return
    }

    const captureContext: CaptureContext = {
      user: {
        name: 'guest',
      },
      level: Severity.Error,
      contexts: {
        'http-context': this.context(ctx),
      },
      tags: {
        requestId: ctx.request.id(),
      },
      requestSession: {
        status: 'errored',
      },
    }
    Sentry.captureException(error, captureContext)
  }

  public async handle(error, ctx) {
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).json(error.messages)
    }

    const statusCode = error.status || 500
    const message = this.getPlaneMessage(error)

    // send html if request is text html
    if (ctx.request.accepts(['html'])) {
      const title = statusCode === 500 ? 'Internal Server Error' : error.message
      return ctx.view.render('error', { title, error })
    }

    return ctx.response.status(statusCode).json({
      error: {
        code: error.code,
        message,
      },
    })
  }

  private getPlaneMessage(error) {
    const mesageArr = error.message.split(': ')
    const message =
      mesageArr[mesageArr.length - 1] || 'Something went wrong. Please try again later.'
    return message
  }
}
