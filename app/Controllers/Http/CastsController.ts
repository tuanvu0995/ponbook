import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import { CastRepo } from 'App/Repos/CastRepo'
import NotFoundException from 'App/Exceptions/NotFoundException'

export default class CastsController {
  public async index({
    request,
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { name } = request.qs()
    const casts = await CastRepo.getCasts(name, pagination.page, pagination.limit)
    return response.json(casts)
  }

  public async show({ params, response }: HttpContextContract) {
    const { slug } = params
    const cast = await CastRepo.findBySlug(slug)
    if (_.isNil(cast)) {
      throw new NotFoundException('Cast not found')
    }
    return response.json(cast)
  }

  public async getVideosByCast({
    params,
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { slug } = params
    const cast = await CastRepo.findBySlug(slug)
    if (_.isNil(cast)) {
      throw new NotFoundException('Cast not found')
    }
    const videos = await CastRepo.getVideosByCast(cast, pagination.page, pagination.limit)
    return response.json(videos)
  }
}
