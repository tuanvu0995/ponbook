import type { EventsList } from '@ioc:Adonis/Core/Event'
import Notification from 'App/Models/Notification'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'

export default class NotificationListener {
  public async onNotificationCreated(notification: EventsList['notification:created']) {
    if (Env.get('FLAG_SEND_EMAIL_NOTIFICATION', false)) {
      await this.sendEmail(notification)
    }
  }

  private async sendEmail(notification: Notification) {
    Logger.info('Sending email notification', {
      userId: notification.userId,
      notificationId: notification.id,
    })
    try {
      await notification.load('user')
      if (!notification.user) {
        Logger.error('Error when send email notification. User not found')
        return
      }

      await Mail.use('mailgun').send(
        (message) => {
          message
            .from(
              Env.get('EMAIL_SENDER_EMAIL', 'no-reply@ponbook.net'),
              Env.get('EMAIL_SENDER_NAME', 'Ponbook Website')
            )
            .to(notification.user.email)
            .subject(`Ponbook - ${notification.title}`)
            .htmlView('emails/notification', { ...notification.serialize() })
        },
        {
          oTags: ['comment:notification'],
        }
      )
    } catch (err) {
      console.log(err)
      Logger.error('Error when send email notification', err.message)
    }
  }
}
