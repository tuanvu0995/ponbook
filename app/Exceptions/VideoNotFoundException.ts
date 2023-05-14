import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new VideoNotFoundException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/

const message = 'Video not found'

export default class VideoNotFoundException extends Exception {
  private videoUid: string
  private isApi: boolean = false

  constructor(videoUid: string, isApi: boolean = false) {
    super(message, 404, 'E_NOT_FOUND')

    this.videoUid = videoUid
    this.isApi = isApi
  }

  public async handle(error: this, ctx: HttpContextContract) {
    Logger.debug('VideoNotFound: ', JSON.stringify({ uid: this.videoUid }))
    if (!this.isApi) {
      return ctx.view.render('errors/not-found')
    }
    ctx.response.status(error.status).send(error.message)
  }
}
