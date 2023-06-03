import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import Comment from 'App/Models/Comment'
import Video from 'App/Models/Video'
import UserRepository from 'App/Repositories/UserRepository'
import VideoRepository from 'App/Repositories/VideoRepository'

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

  public async createGuestComment({ request, response, session, turnstile }: HttpContextContract) {
    if (!turnstile.success) {
      session.flash('error', 'Invalid captcha')
      return response.redirect().back()
    }

    const uid = request.param('uid')

    const video = await VideoRepository.getVideoByUid(uid)
    const commentUser = await UserRepository.getCommentUser()

    const { content, name } = request.all()
    if (!name) {
      session.flash('error', 'Name is required')
      return response.redirect().back()
    }

    if (name.length > 16 || name.length < 3) {
      session.flash('error', 'Name must be between 3 and 16 characters')
      return response.redirect().back()
    }

    if (!content) {
      session.flash('error', 'Comment content is required')
      return response.redirect().back()
    }

    const comment = new Comment()
    comment.content = content
    comment.userId = commentUser.id
    comment.videoId = video.id
    comment.attachmentImages = ''
    comment.isDraft = false
    comment.name = name
    comment.ipAddress = request.ip()
    comment.userAgent = request.header('user-agent') || ''
    await comment.save()

    session.put('comment_user_name', name)

    await VideoRepository.updateVideo(video.id, { commentCount: video.commentCount + 1 })

    Event.emit('comment:created', comment)

    return response.redirect().back()
  }
}
