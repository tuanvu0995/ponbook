import Cast from 'App/Models/Cast'

export class CastRepo {
  public static async findBySlug(slug: string) {
    return await Cast.query().where('slug', slug).first()
  }

  public static async getCasts(name: string = '', page = 1, limit = 10) {
    const query = Cast.query()
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
      .paginate(page, limit)
  }
}
