import Tag from 'App/Models/Tag'

export class TagRepo {
  public static async findBySlug(slug: string) {
    return await Tag.query().where('slug', slug).first()
  }

  public static async getTags(name: string = '', page = 1, limit = 10) {
    const query = Tag.query()
    if (name) {
      query.whereRaw('name LIKE ?', [`%${name}%`])
    }
    return await query.orderBy('name', 'asc').paginate(page, limit)
  }

  public static async getVideosByTag(tag: Tag, page = 1, limit = 10) {
    return await tag
      .related('videos')
      .query()
      .preload('casts')
      .preload('cover')
      .orderBy('release_date', 'desc')
      .paginate(page, limit)
  }

  public static async getRandomTags() {
    return await Tag.query().orderByRaw('RAND()').limit(10)
  }
}
