import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Video from 'App/Models/Video'

export default class CommentController {
  public async store({ request, view, auth, response }: HttpContextContract) {
    const uid = request.param('uid')

    const video = await Video.query().where('uid', uid).where('is_published', true).first()
    if (!video) return view.render('errors/not-found')

    const user = await auth.authenticate()

    const { content, parentId } = request.all()

    let comment = await Comment.query()
      .where('video_id', video.id)
      .where('user_id', user.id)
      .where('is_draft', true)
      .first()

    if (!comment) {
      comment = new Comment()
    }

    comment.content = content
    comment.userId = user.id
    comment.videoId = video.id
    comment.attachmentImages = ''
    if (parentId) {
      comment.parentId = parentId
      comment.isReply = true
    }
    comment.isDraft = false
    await comment.save()

    video.commentCount += 1
    await video.save()

    console.log('comment saved')
    return response.redirect().back()
  }
}
