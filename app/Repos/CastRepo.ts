import Cast from 'App/Models/Cast'
import { PaginatedFilters, PaginatedSorts } from 'App/common/types'

export class CastRepo {
  public static async findByUid(uid: string) {
    return await Cast.query().where('uid', uid).first()
  }

  public static async findBySlug(slug: string, withCount = false) {
    const query = Cast.query().where('slug', slug)
    if (withCount) {
      query.withCount('videos')
        .withCount('users')
    }
    return await query.first()
  }

  public static async getCasts(name: string = '', page = 1, limit = 10) {
    const query = Cast.query().preload('photo').withCount('videos')
    if (name) {
      query.whereRaw('name LIKE ?', [`%${name}%`])
    }
    return await query.orderBy('name', 'asc').paginate(page, limit)
  }

  public static async getVideosByCast(
    cast: Cast,
    page = 1,
    limit = 10,
    filters?: PaginatedFilters,
    sorts?: PaginatedSorts
  ) {
    return await cast
      .related('videos')
      .query()
      .preload('cover')
      .where('is_deleted', false)
      .where('is_published', true)
      .filterWithPaginate(page, limit, filters, sorts)
  }

  public static async getVideosForCastOnly(
    cast: Cast,
    page = 1,
    limit = 10,
    filters?: PaginatedFilters,
    sorts?: PaginatedSorts
  ) {
    return await cast
      .related('videos')
      .query()
      .preload('cover')
      .where('is_deleted', false)
      .where('is_published', true)
      .has('casts', '=', 1)
      .filterWithPaginate(page, limit, filters, sorts)
  }
}
