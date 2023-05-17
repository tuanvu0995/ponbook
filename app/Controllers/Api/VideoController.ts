import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PBVideoRepository from 'App/Repositories/Api/PBVideoRepository'
import validatePaginationQuery from 'App/utils/validatePaginationQuery'
export default class VideoController {
  public async show({ params, response }: HttpContextContract) {
    const video = await PBVideoRepository.getVideoByUid(params.uid)
    return response.json(video.serialize())
  }

  public async getRecentAddedVideos({ request, response }: HttpContextContract) {
    const { limit = 10, page } = await validatePaginationQuery(request.qs())

    const shouldPaginate = !_.isNil(page)
    const videos = await PBVideoRepository.getRecentAddedVideos(limit, page, shouldPaginate)

    return response.json(videos)
  }

  public async getNewCommentAddedVideos({ request, response }: HttpContextContract) {
    const { limit = 10, page } = await validatePaginationQuery(request.qs())

    const shouldPaginate = !_.isNil(page)
    const videos = await PBVideoRepository.getNewCommentAddedVideos(limit, page, shouldPaginate)

    return response.json(videos)
  }

  public async getRelatedVideos({ request, response }: HttpContextContract) {
    const uid = request.param('uid')
    const { limit = 10 } = await validatePaginationQuery(request.qs())

    const videos = await PBVideoRepository.getRelatedVideos(uid, limit)

    return response.json(videos)
  }
}
