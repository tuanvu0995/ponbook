import _ from 'lodash'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

export default class Contact {
  public async onContactCreated(contact: EventsList['contact:created']) {
    Logger.info('New Contact Message Just Received.')
    await this.sendContactEmail(contact)
  }

  private async sendContactEmail(contact: EventsList['contact:created']) {
    const adminEmail = Env.get('ADMIN_EMAIL')
    if (_.isNil(adminEmail)) return

    const template = _.template(`
        Hi Admin, New Contact Message Just Received.
        Email: ${contact.email}
        name: ${contact.name}
        Subject: ${contact.subject}
        Created At: ${contact.createdAt}
        Message: ${contact.message}
    `)

    await Mail.use('mailgun').send((message) => {
      message
        .from(
          Env.get('EMAIL_SENDER_EMAIL', 'no-reply@ponbook.net'),
          Env.get('EMAIL_SENDER_NAME', 'Ponbook Website')
        )
        .to(adminEmail)
        .subject('Hi Admin, New User Just Registered')
        .text(template(contact))
    })
  }
}
