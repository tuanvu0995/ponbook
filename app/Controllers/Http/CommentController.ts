import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { HttpRequestPagination } from '@ioc:Contracts'
import VideoRepo from 'App/Repos/VideoRepo'
import CommentRepo from 'App/Repos/CommentRepo'
import CreateCommentValidator from 'App/Validators/CreateCommentValidator'

export default class CommentController {
  public async store({ request, response, auth }: HttpContextContract) {
    const body = await request.validate(CreateCommentValidator)

    const video = await VideoRepo.getVideoByUid(body.videoUid)
    if (_.isNil(video)) throw new NotFoundException('Video not found')

    let parent
    if (body.commentUid) {
      parent = await CommentRepo.getCommentByUid(body.commentUid)
      if (_.isNil(parent)) throw new NotFoundException('Comment not found')
    }

    const createBody = {
      videoId: video.id,
      userId: auth.user!.id,
      content: body.content,
      parentId: parent?.id,
      isApproved: true,
      isDraft: false,
      attachmentImages: '[]',
    }

    const comment = await CommentRepo.createComment(createBody)
    return response.json(comment)
  }

  public async getCommentsByVideoUid({
    params,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const { uid } = params
    const video = await VideoRepo.getVideoByUid(uid)
    if (_.isNil(video)) throw new NotFoundException('Video not found')

    const comments = await CommentRepo.getCommentsByVideo(video, pagination.page, pagination.limit)

    return response.json(comments)
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const { uid } = params
    const comment = await CommentRepo.getCommentByUid(uid)
    if (_.isNil(comment)) throw new NotFoundException('Comment not found')

    if (comment.userId !== auth.user!.id) throw new NotFoundException('Comment not found')

    await CommentRepo.deleteComment(comment)

    return response.json({ message: 'Comment deleted successfully' })
  }
}
