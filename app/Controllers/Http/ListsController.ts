import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import VideoRepo from 'App/Repos/VideoRepo'

export default class ListsController {
  public async recentVideos({ pagination, response }: HttpContextContract & HttpRequestPagination) {
    const { page, limit } = pagination
    const recentVideos = await VideoRepo.getRecentVideos(page, limit)
    return response.json(recentVideos)
  }

  public async newCommentAddedVideos({
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const { page, limit } = pagination
    const newUpdatedVideos = await VideoRepo.getNewCommentAddedVideos(page, limit)
    return response.json(newUpdatedVideos)
  }
}
