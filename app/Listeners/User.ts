import _ from 'lodash'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'
import Route from '@ioc:Adonis/Core/Route'

export default class User {
  public async onUserLoggedIn(user: EventsList['user:logged-in']) {
    await this.sendLoginAlertToAdmin(user)
  }

  public async onUserCreated(user: EventsList['user:created']) {
    await this.sendWelcomeEmail(user)
    await this.sendNewUserAlertToAdmin(user)
  }

  private async sendWelcomeEmail(user: EventsList['user:created']) {
    await Mail.use('mailgun').send(
      (message) => {
        message
          .from(
            Env.get('EMAIL_SENDER_EMAIL', 'no-reply@ponbook.net'),
            Env.get('EMAIL_SENDER_NAME', 'Ponbook Team')
          )
          .to(user.email)
          .subject('Welcome to PonBook Team')
          .htmlView('emails/welcome', { name: user.username })
      },
      {
        oTags: ['signup'],
      }
    )
  }

  public async onUserRequestResetLink(user: EventsList['user:request-reset-link']) {
    const signedUrl = Route.makeSignedUrl(
      'auth.resetPassword',
      {
        uid: user.uid,
      },
      {
        expiresIn: '15m',
      }
    )

    console.log(signedUrl)

    await Mail.use('mailgun').send(
      (message) => {
        message
          .from(
            Env.get('EMAIL_SENDER_EMAIL', 'no-reply@ponbook.net'),
            Env.get('EMAIL_SENDER_NAME', 'Ponbook Team')
          )
          .to(user.email)
          .subject('Reset Password Request - Ponbook.net')
          .htmlView('emails/reset-link', { signedUrl, name: user.fullName })
      },
      {
        oTags: ['reset-password'],
      }
    )
  }

  private async sendLoginAlertToAdmin(user: EventsList['user:logged-in']) {
    const adminEmail = Env.get('ADMIN_EMAIL')
    if (_.isNil(adminEmail)) return

    const template = _.template(`
        New user logged in to Ponbook Team.
        Email: ${user.email}
        Username: ${user.username}
        Login At: ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}
    `)

    await Mail.use('mailgun').send((message) => {
      message
        .from(
          Env.get('EMAIL_SENDER_EMAIL', 'no-reply@ponbook.net'),
          Env.get('EMAIL_SENDER_NAME', 'Ponbook Team')
        )
        .to(adminEmail)
        .subject('Hi Admin, New user logged in')
        .text(template(user))
    })
  }

  private async sendNewUserAlertToAdmin(user: EventsList['user:created']) {
    const adminEmail = Env.get('ADMIN_EMAIL')
    if (_.isNil(adminEmail)) return

    const template = _.template(`
        New user just registered on PonBook Team.
        Email: ${user.email}
        Username: ${user.username}
        Register At: ${user.createdAt}
    `)

    await Mail.use('mailgun').send((message) => {
      message
        .from(
          Env.get('EMAIL_SENDER_EMAIL', 'no-reply@ponbook.net'),
          Env.get('EMAIL_SENDER_NAME', 'Ponbook Team')
        )
        .to(adminEmail)
        .subject('Hi Admin, New User Just Registered')
        .text(template(user))
    })
  }
}
