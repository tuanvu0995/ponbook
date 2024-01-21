import _ from 'lodash'
import Video from 'App/Models/Video'
import Cast from 'App/Models/Cast'
import Tag from 'App/Models/Tag'
import SearchTerm from 'App/Models/SearchTerm'
import { PaginatedOptionList } from 'App/common/types'

export default class SearchRepo {
  private static isCode(keyword: string): boolean {
    // eslint-disable-next-line no-useless-escape
    const codeRegex = /^[a-zA-Z]+\-\d{3,4}$/ // định dạng mã code là chữ in hoa đầu tiên, theo sau là dấu "-", và 3 hoặc 4 chữ số
    return codeRegex.test(keyword)
  }

  public static async getSuggestions(keyword: string) {
    const query = SearchTerm.query().where('is_hidden', false)

    if (keyword) {
      query.where('term', 'like', `${keyword}%`)
    }
    return await query
      .orderBy('last_day_count', 'desc')
      .orderBy('last_week_count', 'desc')
      .orderBy('last_month_count', 'desc')
      .limit(10)
  }

  public static async search(keyword: string, options: PaginatedOptionList) {
    const isCode = this.isCode(keyword)
    if (isCode) {
      return await this.searchByCode(keyword, options)
    }

    return await this.searchFulltext(keyword, options)
  }

  private static searchByCode(keyword: string, options: PaginatedOptionList) {
    const searchValues = this.praseCode(keyword)

    return Video.query()
      .preload('cover')
      .whereIn('code', searchValues)
      .where('is_published', true)
      .where('is_deleted', false)
      .filterWithPaginate(options.page, options.limit, options.filters, options.sorts)
  }

  private static searchFulltext(keyword: string, options: PaginatedOptionList) {
    return Video.query()
      .preload('cover')
      .innerJoin('video_casts', 'videos.id', 'video_casts.video_id')
      .innerJoin('casts', 'casts.id', 'video_casts.cast_id')
      .innerJoin('video_tags', 'videos.id', 'video_tags.video_id')
      .innerJoin('tags', 'tags.id', 'video_tags.tag_id')
      .whereRaw('code LIKE ?', [`%${keyword}%`])
      .orWhereRaw('title LIKE ?', [`%${keyword}%`])
      .orWhereRaw('casts.name LIKE ?', [`%${keyword}%`])
      .orWhereRaw('tags.name LIKE ?', [`%${keyword}%`])
      .where('is_published', true)
      .where('is_deleted', false)
      .groupBy('videos.id')
      .filterWithPaginate(options.page, options.limit, options.filters, options.sorts)
  }

  public static async searchCasts(keyword: string, limit: number = 10): Promise<Cast[]> {
    const casts = await Cast.query()
      .whereRaw('name LIKE ?', [`%${keyword}%`])
      .orderByRaw(
        `
        CASE
          WHEN name LIKE ? THEN 1
          WHEN name LIKE ? THEN 2
          WHEN name LIKE ? THEN 4
          ELSE 3
        END
      `,
        [keyword, `${keyword}%`, `%${keyword}`]
      )
      .limit(limit)
    return casts
  }

  public static async searchTags(keyword: string, limit: number = 5): Promise<Tag[]> {
    const tags = await Tag.query()
      .whereRaw('name LIKE ?', [`%${keyword}%`])
      .orderByRaw(
        `
        CASE
          WHEN name LIKE ? THEN 1
          WHEN name LIKE ? THEN 2
          WHEN name LIKE ? THEN 4
          ELSE 3
        END
      `,
        [keyword, `${keyword}%`, `%${keyword}`]
      )
      .limit(limit)
    return tags
  }

  private static praseCode(code: string): string[] {
    const upperCaseCode = code.toLowerCase()
    const values: string[] = [upperCaseCode]
    if (_.includes(upperCaseCode, '-')) {
      const parts = upperCaseCode.split('-')
      values.push(`${parts[0]}-${Number(parts[1])}`)

      values.push(parts[1])
    }
    return values
  }

  public static parseTitle(keyword: string): string[] {
    const lowerCaseKeyword = keyword.toLowerCase()
    const values: string[] = [lowerCaseKeyword]
    return values
  }
}
