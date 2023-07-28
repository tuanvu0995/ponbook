import Director from 'App/Models/Director'

export class DirectorRepo {
  public static async findByUid(uid: string) {
    return await Director.query().where('uid', uid).first()
  }

  public static async findBySlug(slug: string) {
    return await Director.query().where('slug', slug).first()
  }

  public static async getDirectors(name: string = '', page = 1, limit = 10) {
    const query = Director.query()
    if (name) {
      query.whereRaw('name LIKE ?', [`%${name}%`])
    }
    return await query.orderBy('name', 'asc').paginate(page, limit)
  }

  public static async getVideosByDirector(director: Director, page = 1, limit = 10) {
    return await director
      .related('videos')
      .query()
      .preload('cover')
      .orderBy('release_date', 'desc')
      .paginate(page, limit)
  }
}
