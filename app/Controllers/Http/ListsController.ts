import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import InternalServerErrorException from 'App/Exceptions/InternalServerErrorException'
import CollectionRepo from 'App/Repos/CollectionRepo'
import VideoRepo from 'App/Repos/VideoRepo'

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
    return response.json(newUpdatedVideos)
  }

  public async popularVideos({
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { page, limit } = pagination
    const popularVideos = await VideoRepo.getPopularVideos(page, limit)
    if (_.isNil(popularVideos)) throw new InternalServerErrorException()
    return response.json(popularVideos)
  }

  public async newRelease({ pagination, response }: HttpContextContract & HttpRequestPagination) {
    const { page, limit } = pagination
    const newReleaseVideos = await VideoRepo.getNewReleaseVideos(page, limit)
    if (_.isNil(newReleaseVideos)) throw new InternalServerErrorException()
    return response.json(newReleaseVideos)
  }
}
