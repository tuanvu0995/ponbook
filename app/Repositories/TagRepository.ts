import Tag from 'App/Models/Tag'

export default class TagRepository {
  public static async getRandomTags() {
    const tags = await Tag.query().orderByRaw('RAND()').limit(10)
    return tags
  }
}
