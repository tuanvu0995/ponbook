import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import { TagRepo } from 'App/Repos/TagRepo'
import NotFoundException from 'App/Exceptions/NotFoundException'

export default class TagsController {
  public async index({
    request,
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { name } = request.qs()
    const tags = await TagRepo.getTags(name, pagination.page, pagination.limit)
    return response.json(tags)
  }

  public async show({ params, response }: HttpContextContract) {
    const { slug } = params
    const tag = await TagRepo.findBySlug(slug)
    if (_.isNil(tag)) {
      throw new NotFoundException('Tag not found')
    }
    return response.json(tag)
  }

  public async getVideosByTag({
    params,
    pagination,
    response,
  }: HttpContextContract & HttpRequestPagination) {
    const { slug } = params
    const tag = await TagRepo.findBySlug(slug)
    if (_.isNil(tag)) {
      throw new NotFoundException('Tag not found')
    }
    const videos = await TagRepo.getVideosByTag(tag, pagination.page, pagination.limit)
    return response.json(videos)
  }

  public async getRandomTags({ response }: HttpContextContract) {
    const tags = await TagRepo.getRandomTags()
    return response.json(tags)
  }
}
