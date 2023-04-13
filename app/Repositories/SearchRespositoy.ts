import _ from 'lodash'
import Video from 'App/Models/Video'
import Cast from 'App/Models/Cast'
import Tag from 'App/Models/Tag'

export default class SearchRepository {
  private static isCode(keyword: string): boolean {
    const codeRegex = /^[a-zA-Z]+\-\d{3,4}$/ // định dạng mã code là chữ in hoa đầu tiên, theo sau là dấu "-", và 3 hoặc 4 chữ số
    return codeRegex.test(keyword)
  }

  public static async searchVideos(keyword: string): Promise<Video[]> {
    const isCode = this.isCode(keyword)
    if (isCode) {
      const videos = await this._searchVideosByCode(keyword)
      if (videos.length > 0) {
        return videos
      }
    }
    const videos = await this._searchVideosByTitle(keyword)
    return videos
  }

  private static async _searchVideosByCode(keyword: string, limit: number = 10): Promise<Video[]> {
    const searchValues = this.praseCode(keyword)

    const videos = await Video.query()
      .whereIn('code', searchValues)
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .limit(limit)

    return videos
  }

  private static async _searchVideosByTitle(keyword: string, limit: number = 10): Promise<Video[]> {
    const videos = await Video.query()
      .whereRaw('title LIKE ?', [`%${keyword}%`])
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .orderByRaw(
        `
        CASE
          WHEN title LIKE ? THEN 1
          WHEN title LIKE ? THEN 2
          WHEN title LIKE ? THEN 4
          ELSE 3
        END
      `,
        [keyword, `${keyword}%`, `%${keyword}`]
      )
      .limit(limit)

    return videos
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
