import type { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'

export default class Comment {
  public async onCommentCreated(comment: EventsList['comment:created']) {
    const subject = 'New user comment'
    const video = await comment.related('video').query().firstOrFail()

    const actionUrl = Env.get('APP_DOMAIN') + '/v/' + video.uid

    await Mail.send((message) => {
      message
        .from('ponbook0102@outlook.com')
        .to('tuanvu0995@gmail.com')
        .subject(subject)
        .htmlView('emails/new-comment', { name: 'Vu Lai', subject, actionUrl })
    })

    Logger.info('New comment created. Send email to admin', comment.uid)
  }
}
