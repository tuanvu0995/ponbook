import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { HttpRequestPagination } from '@ioc:Contracts'
import VideoRepo from 'App/Repos/VideoRepo'
import CommentRepo from 'App/Repos/CommentRepo'

export default class CommentController {
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
}
