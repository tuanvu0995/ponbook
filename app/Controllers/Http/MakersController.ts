import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { MakerRepo } from 'App/Repos/MakerRepo'

export default class DirectorsController {
  public async index({
    request,
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { name } = request.qs()
    const makers = await MakerRepo.getMakers(name, pagination.page, pagination.limit)
    return response.json(makers)
  }

  public async show({ params, response }: HttpContextContract) {
    const { uid } = params
    const maker = await MakerRepo.findByUid(uid)
    if (_.isNil(maker)) {
      throw new NotFoundException('Maker not found')
    }
    return response.json(maker)
  }

  public async getVideosByMaker({
    params,
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { uid } = params
    const maker = await MakerRepo.findByUid(uid)

    if (_.isNil(maker)) {
      throw new NotFoundException('Maker not found')
    }

    const videos = await MakerRepo.getVideosByMaker(maker, pagination.page, pagination.limit)
    return response.json(videos)
  }
}
