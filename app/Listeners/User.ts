import _ from 'lodash'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class User {
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
            Env.get('EMAIL_SENDER_NAME', 'Ponbook Website')
          )
          .to(user.email)
          .subject('Welcome to PonBook website')
          .htmlView('emails/welcome', { name: user.username })
      },
      {
        oTags: ['signup'],
      }
    )
  }

  private async sendNewUserAlertToAdmin(user: EventsList['user:created']) {
    const adminEmail = Env.get('ADMIN_EMAIL')
    if (_.isNil(adminEmail)) return

    const template = _.template(`
        New user just registered on PonBook website.
        Email: ${user.email}
        Username: ${user.username}
        Register At: ${user.createdAt}
    `)

    await Mail.use('mailgun').send((message) => {
      message
        .from(
          Env.get('EMAIL_SENDER_EMAIL', 'no-reply@ponbook.net'),
          Env.get('EMAIL_SENDER_NAME', 'Ponbook Website')
        )
        .to(adminEmail)
        .subject('Hi Admin, New User Just Registered')
        .text(template(user))
    })
  }
}
