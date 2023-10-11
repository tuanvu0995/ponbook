import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import Collection from 'App/Models/Collection'
import CollectionRepo from 'App/Repos/CollectionRepo'

export default class CollectionsController {
  public async store({ request, response }: HttpContextContract) {
    const body = request.only(['name', 'description', 'slug'])
    const collection = await Collection.create(body)
    return response.json(collection)
  }

  public async getVideosBySlug({
    params,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const videos = await CollectionRepo.getVideosByCollectionSlug(
      params.slug,
      pagination.page,
      pagination.limit
    )

    return response.json(videos)
  }
}
