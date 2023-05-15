import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PBCollectionRepository from 'App/Repositories/Api/PBCollectionRepository'

export default class CollectionController {
  public async show({ request, params, response }: HttpContextContract) {
    const { limit = 1 } = request.qs()
    const collection = await PBCollectionRepository.getCollection(params.slug, limit)
    return response.json(collection)
  }
}
