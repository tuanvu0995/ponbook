import Event from '@ioc:Adonis/Core/Event'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import NotFoundException from 'App/Exceptions/NotFoundException'
import CategoryRepo from 'App/Repos/CategoryRepo'
import CreateCategoryValidator from 'App/Validators/CreateCategoryValidator'

export default class CategoryController {
  public async store({ request, response }) {
    const body = await request.validate(CreateCategoryValidator)

    const category = await CategoryRepo.create(body)

    return response.status(200).json(category)
  }

  public async recalculate({ response }) {
    Event.emit('category:recalculate', undefined)
    return response.status(200).json({
      message: 'Calculate category',
    })
  }

  public async index({
    request,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const { parentId } = request.qs()
    const clearnedParentId = parentId ? parseInt(parentId) : null
    const categories = await CategoryRepo.getCategories(
      clearnedParentId,
      pagination.page,
      pagination.limit
    )
    return response.status(200).json(categories)
  }

  public async getBySlug({ params, response }) {
    const category = await CategoryRepo.getCategoriesBySlug(params.slug)
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return response.status(200).json(category.serialize())
  }

  public async getVideosBySlug({
    params,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const category = await CategoryRepo.getCategoriesBySlug(params.slug)
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    const videos = await category
      .related('videos')
      .query()
      .preload('cover')
      .preload('casts')
      .orderBy('release_date', 'desc')
      .where('is_published', true)
      .paginate(pagination.page, pagination.limit)
    return response.json(videos)
  }
}
