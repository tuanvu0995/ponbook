import type { EventsList } from '@ioc:Adonis/Core/Event'

export default class Comment {
  public async onCommentCreated(comment: EventsList['comment:created']) {
    console.log(comment.uid)
  }
}
