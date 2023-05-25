import axios from 'axios'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class TurnstileService {
  constructor(protected ctx: HttpContextContract) {}

  public async check(): Promise<boolean> {
    if (this.ctx.session.get('TURNSTILE_STATUS') === true) {
      return true
    }

    const token = this.ctx.request.input('cf-turnstile-response')
    const ip = this.ctx.request.header('cf-connecting-ip')

    const { data } = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: Env.get('CF_TURNSTILE_KEY'),
      response: token,
      remoteip: ip,
    })

    this.ctx.logger.info('Turnstile response', data.success)
    this.ctx.session.put('TURNSTILE_STATUS', data.success)

    if (!data.success) {
      this.ctx.session.flash('error', 'Your request has been flagged as suspicious.')
    }

    return data.success
  }
}
