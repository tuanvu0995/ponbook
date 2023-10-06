import BadRequestException from 'App/Exceptions/BadRequestException'
import Category, { Breadcrumb } from 'App/Models/Category'

export default class CategoryRepo {
  public static async create(input: any) {
    const breadcrumbs: Breadcrumb[] = []
    if (input.parentId) {
      const categories = await this.getCategoriesByParentId(input.parentId)
      if (!categories.length) throw new BadRequestException('Parent category not found')
      input.slug = this.createSlug(input.slug, categories)
      breadcrumbs.push(
        ...categories.map((category) => ({ slug: category.slug, name: category.name }))
      )
    }

    breadcrumbs.push({
      slug: input.slug,
      name: input.name,
    })
    input.breadcrumbs = JSON.stringify(breadcrumbs)
    return await Category.create(input)
  }

  public static async getParents(category: Category) {
    if (!category.parentId) return []
    return await this.getCategoriesByParentId(category.parentId)
  }

  private static async getCategoriesByParentId(
    parentId: number,
    categories: Category[] = []
  ): Promise<Category[]> {
    if (!parentId) return categories
    const category = await Category.query()
      .where('id', parentId)
      .where('is_published', true)
      .first()
    if (!category) return categories
    return await this.getCategoriesByParentId(category.parentId, [...categories, category])
  }

  private static createSlug(slug: string, categories: Category[]) {
    const slugs = categories.map((category) => category.slug)

    return [...slugs, slug].join('-')
  }

  public static async getCategoriesBySlug(slug: string) {
    return await Category.query()
      .preload('children')
      .where('slug', slug)
      .where('is_published', true)
      .first()
  }

  public static async getCategories(parentId: number | null, page: number, limit: number) {
    return await Category.query()
      .where('is_published', true)
      .where((qs) => {
        if (typeof parentId === 'number') {
          qs.where('parentId', parentId)
        } else {
          qs.whereNull('parentId')
        }
      })
      .whereNull('parentId')
      .paginate(page, limit)
  }
}
