import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepository from 'App/Repositories/VideoRepository'
import NotFoundException from 'App/Exceptions/NotFoundException'
import CommentRepository from 'App/Repositories/CommentRepository'
import { HttpRequestPagination } from '@ioc:Contracts'

export default class CommentController {
  public async getCommentsByVideoUid({
    params,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const { uid } = params
    const { page, limit } = pagination
    const video = await VideoRepository.getVideoByUid(uid)
    if (_.isNil(video)) throw new NotFoundException('Video not found')

    const comments = await CommentRepository.getCommentByVideoId(video.id, page, limit)

    return response.json(
      comments.serialize({
        fields: {
          pick: [
            'uid',
            'content',
            'name',
            'vote_up_count',
            'vote_down_count',
            'created_at',
            'updated_at',
          ],
        },
        relations: {
          owner: {
            fields: {
              pick: ['uid', 'username', 'fullName', 'avatar', 'gender'],
            },
          },
        },
      })
    )
  }
}
