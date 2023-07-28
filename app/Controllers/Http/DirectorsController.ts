import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { DirectorRepo } from 'App/Repos/Director'

export default class DirectorsController {
  public async index({
    request,
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { name } = request.qs()
    const casts = await DirectorRepo.getDirectors(name, pagination.page, pagination.limit)
    return response.json(casts)
  }

  public async show({ params, response }: HttpContextContract) {
    const { uid } = params
    const cast = await DirectorRepo.findByUid(uid)
    if (_.isNil(cast)) {
      throw new NotFoundException('Director not found')
    }
    return response.json(cast)
  }

  public async getVideosByDirector({
    params,
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { uid } = params
    const cast = await DirectorRepo.findByUid(uid)

    if (_.isNil(cast)) {
      throw new NotFoundException('Director not found')
    }

    const videos = await DirectorRepo.getVideosByDirector(cast, pagination.page, pagination.limit)
    return response.json(videos)
  }
}
