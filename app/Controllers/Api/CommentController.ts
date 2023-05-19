import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PBCommentRepository from 'App/Repositories/Api/PBCommentRepository'
import validatePaginationQuery from 'App/utils/validatePaginationQuery'

export default class CommentController {
  public async getCommentsByVideo({ request, response }: HttpContextContract) {
    const videoUid = request.param('videoUid')

    const { limit = 10, page = 1 } = await validatePaginationQuery(request.qs())

    const comments = await PBCommentRepository.getCommentsByVideo(videoUid, limit, page)

    return response.json(comments)
  }
}
