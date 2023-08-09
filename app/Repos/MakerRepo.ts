import Maker from 'App/Models/Maker'

export class MakerRepo {
  public static async findByUid(uid: string) {
    return await Maker.query().where('uid', uid).first()
  }

  public static async findBySlug(slug: string) {
    return await Maker.query().where('slug', slug).first()
  }

  public static async getMakers(name: string = '', page = 1, limit = 10) {
    const query = Maker.query()
    if (name) {
      query.whereRaw('name LIKE ?', [`%${name}%`])
    }
    return await query.orderBy('name', 'asc').paginate(page, limit)
  }

  public static async getVideosByMaker(maker: Maker, page = 1, limit = 10) {
    return await maker
      .related('videos')
      .query()
      .preload('cover')
      .where('is_deleted', false)
      .where('is_published', true)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)
  }
}
