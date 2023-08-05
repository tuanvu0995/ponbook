import Page from 'App/Models/Page'

export default class PageRepo {
  public static async findBySlug(slug: string) {
    return await Page.query().where('slug', slug).first()
  }
}
