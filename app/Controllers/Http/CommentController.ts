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
    const comment = new Comment()
    comment.content = content
    comment.userId = user.id
    comment.videoId = video.id
    if (parentId) {
      comment.parentId = parentId
      comment.isReply = true
    }
    await comment.save()
    console.log('comment saved')
    return response.redirect().back()
  }
}
