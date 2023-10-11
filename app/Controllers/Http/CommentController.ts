import _ from 'lodash'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { HttpRequestPagination } from '@ioc:Contracts'
import { Limiter } from '@adonisjs/limiter/build/services'
import VideoRepo from 'App/Repos/VideoRepo'
import CommentRepo from 'App/Repos/CommentRepo'
import CreateCommentValidator from 'App/Validators/CreateCommentValidator'
import BadRequestException from 'App/Exceptions/BadRequestException'
import { DateTime } from 'luxon'
import TooManyRequestException from 'App/Exceptions/TooManyRequestException'
import Comment from 'App/Models/Comment'

export default class CommentController {
  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user!
    const throttleKey = `send_comment_${user.uid}_${request.ip}`
    const limiter = Limiter.use({
      requests: 10,
      duration: '2 mins',
      blockDuration: '10 mins',
    })
    if (await limiter.isBlocked(throttleKey)) {
      throw new TooManyRequestException(
        'Send comment attempts exhausted. Please try after some time'
      )
    }

    const body = await request.validate(CreateCommentValidator)

    let video
    if (body.videoUid) {
      video = await VideoRepo.getVideoByUid(body.videoUid)
      if (_.isNil(video)) throw new NotFoundException('Video not found')
    }

    let parent: Comment | null = null
    if (body.parentUid) {
      parent = await CommentRepo.getCommentByUid(body.parentUid)
      if (_.isNil(parent)) throw new NotFoundException('Comment not found')
    }

    const trimBody = body.content.trim()
    const cleanText = sanitizeHtml(marked.parse(trimBody))

    const createBody = {
      userId: user.id,
      videoId: video?.id,
      parentId: parent?.id,
      content: trimBody,
      htmlContent: cleanText,
      isPublished: true,
      publishedAt: DateTime.now(),
    }

    const comment = await Comment.create(createBody)
    await comment.load('user')

    if (parent) {
      parent.commentCounts += 1
      await parent.save()
    }

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

  public async getCommentsByParentUid({
    params,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const { uid } = params

    const comment = await CommentRepo.getCommentByUid(uid)
    if (_.isNil(comment)) throw new NotFoundException('Comment not found')

    const comments = await CommentRepo.getCommentsByParent(
      comment,
      pagination.page,
      pagination.limit
    )

    return response.json(comments)
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const { uid } = params
    const comment = await CommentRepo.getCommentByUid(uid)
    if (_.isNil(comment)) throw new NotFoundException('Comment not found')

    if (comment.userId !== auth.user!.id) throw new NotFoundException('Comment not found')

    const content = request.input('content')
    if (_.isNil(content)) throw new BadRequestException('Content is required')

    const updatedComment = await CommentRepo.updateComment(comment, { content })
    await updatedComment.load('user')
    return response.json(updatedComment)
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
