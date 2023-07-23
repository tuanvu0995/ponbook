import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import InternalServerErrorException from 'App/Exceptions/InternalServerErrorException'
import CollectionRepo from 'App/Repos/CollectionRepo'
import VideoRepo from 'App/Repos/VideoRepo'
import VideoTransform from 'App/Transforms/VideoTransform'

export default class ListsController {
  public async recentVideos({ pagination, response }: HttpContextContract & HttpRequestPagination) {
    const { page, limit } = pagination
    const recentVideos = await VideoRepo.getRecentVideos(page, limit)
    return response.json(recentVideos.toJSON())
  }

  public async newCommentAddedVideos({
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const { page, limit } = pagination
    const newUpdatedVideos = await VideoRepo.getNewCommentAddedVideos(page, limit)
    VideoTransform.transform(newUpdatedVideos)
    return response.json(newUpdatedVideos)
  }

  public async popularVideos({
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { page, limit } = pagination
    const popularVideos = await CollectionRepo.getVideosByCollectionSlug('popular', page, limit)
    if (_.isNil(popularVideos)) throw new InternalServerErrorException()
    VideoTransform.transform(popularVideos)
    return response.json(popularVideos)
  }
}
