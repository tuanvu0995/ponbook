import _ from 'lodash'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import Comment from 'App/Models/Comment'
import Env from '@ioc:Adonis/Core/Env'
import Notification from 'App/Models/Notification'
import Video from 'App/Models/Video'

export default class CommentListener {
  public async onCommentCreated(comment: EventsList['comment:created']) {
    try {
      if (comment.parentId) {
        await comment.load('comment')
      }
      Logger.info('Comment created', {
        uid: comment.uid,
        userId: comment.userId,
      })
      if (comment.comment && comment.comment.userId !== comment.userId) {
        await this.createParentCommentNotification(comment.comment, comment)
      }
    } catch (err) {
      Logger.error(err, "Error when create comment's notification")
    }
  }

  private async createParentCommentNotification(parent: Comment, comment: Comment) {
    await comment.load('user')

    if (!comment.user) {
      Logger.error('Error when create parent comment notification. Comment user not found')
      return
    }

    const notifcation = new Notification()
    notifcation.userId = parent.userId
    notifcation.type = 'comment'
    notifcation.title = `${comment.user.username} replied to your comment`
    notifcation.content = _.truncate(comment.content, { length: 100 })
    notifcation.data = {
      postId: comment.videoId,
      parentId: parent.id,
      commentId: comment.id,
    }
    // todo: change this to comment link
    const video = await Video.findByOrFail('id', comment.videoId)
    notifcation.link = `${Env.get('APP_DOMAIN')}/v/${video.uid}`
    await notifcation.save()

    Logger.info('Parent comment notification created')
  }
}
