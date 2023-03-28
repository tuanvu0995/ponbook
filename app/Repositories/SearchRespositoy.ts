import _ from 'lodash'
import Video from 'App/Models/Video'
import VideoFilter from 'App/Models/VideoFilter'

export default class SearchRepository {
  public static async searchVideosByCode(code: string): Promise<VideoFilter> {
    const searchValues = this.praseCode(code)
    const searchKey = `search:video:${searchValues.join('-')}`

    const existsFilter = await VideoFilter.query().where('key', searchKey).first()
    if (existsFilter) return existsFilter

    const videos = await Video.query()
      .whereIn('code', searchValues)
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .select('id', 'release_date')

    const videoIds = videos.map((video) => video.id)

    const videoFilter = new VideoFilter()
    videoFilter.key = searchKey
    videoFilter.originKeyword = code
    videoFilter.searchParams = JSON.stringify(searchValues)
    await videoFilter.save()

    await videoFilter.related('videos').attach(videoIds)

    return videoFilter
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
}
