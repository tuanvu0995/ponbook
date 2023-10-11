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
      Logger.info(
        {
          uid: comment.uid,
          userId: comment.userId,
        },
        'Comment created'
      )
      await this.createParentCommentNotification(comment)
    } catch (err) {
      Logger.error(err, "Error when create comment's notification")
    }
  }

  private async createParentCommentNotification(comment: Comment) {
    if (!comment.parentId) return
    await comment.load('parent')
    await comment.load('user')

    if (!comment.user) {
      Logger.error('Error when create parent comment notification. Comment user not found')
      return
    }

    const notifcation = new Notification()
    notifcation.userId = comment.parent.userId
    notifcation.type = 'comment'
    notifcation.title = `${comment.user.username} replied to your comment`
    notifcation.content = _.truncate(comment.content, { length: 100 })
    notifcation.data = {
      postId: comment.videoId,
      parentId: comment.parent.id,
      commentId: comment.id,
    }
    // todo: change this to comment link
    const video = await Video.query().where('id', comment.videoId).first()
    if (!video) {
      Logger.error('Error when create parent comment notification. Video not found')
      return
    }

    notifcation.link = `${Env.get('APP_DOMAIN')}/v/${video.uid}`
    await notifcation.save()

    Logger.info('Parent comment notification created')
  }
}
