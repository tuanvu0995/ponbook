import Cast from 'App/Models/Cast'

export class CastRepo {
  public static async findByUid(uid: string) {
    return await Cast.query().where('uid', uid).first()
  }

  public static async findBySlug(slug: string) {
    return await Cast.query().where('slug', slug).first()
  }

  public static async getCasts(name: string = '', page = 1, limit = 10) {
    const query = Cast.query().preload('photo').withCount('videos')
    if (name) {
      query.whereRaw('name LIKE ?', [`%${name}%`])
    }
    return await query.orderBy('name', 'asc').paginate(page, limit)
  }

  public static async getVideosByCast(cast: Cast, page = 1, limit = 10) {
    return await cast
      .related('videos')
      .query()
      .preload('cover')
      .where('is_deleted', false)
      .where('is_published', true)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)
  }

  public static async getVideosForCastOnly(cast: Cast, page = 1, limit = 10) {
    return await cast
      .related('videos')
      .query()
      .preload('cover')
      .where('is_deleted', false)
      .where('is_published', true)
      .has('casts', '=', 1)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)
  }
}
