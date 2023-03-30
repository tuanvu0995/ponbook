import type { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'

export default class Comment {
  public async onCommentCreated(comment: EventsList['comment:created']) {
    const subject = 'New user comment'
    await Mail.send((message) => {
      message
        .from('ponbook0102@outlook.com')
        .to('tuanvu0995@gmail.com')
        .subject(subject)
        .htmlView('emails/new-comment', { name: 'Vu Lai', subject })
    })

    Logger.info('New comment created. Send email to admin', comment.uid)
  }
}
