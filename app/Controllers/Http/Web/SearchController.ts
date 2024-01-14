import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import MeiliSearch from '@ioc:MeiliSearch'
import VideoRepo from 'App/Repos/VideoRepo'
import { SearchPaginator } from 'App/common/SearchPaginator'
import Event from '@ioc:Adonis/Core/Event'

export default class SearchController {
  public async search({ request, pagination, view }: HttpContextContract & HttpRequestPagination) {
    const searchParams = request.qs()
    const term = searchParams.term
    const { page = 1, limit = 36 } = pagination

    const results = await MeiliSearch.search('videos', term, {
      offset: (page - 1) * limit,
      limit,
      sort: ['releaseDate:desc'],
    })

    const videoIds = results.hits.map((hit) => hit.id)

    const videos = await VideoRepo.getVideosByIds(videoIds)

    const paginated = new SearchPaginator(videos, results.estimatedTotalHits, limit, page)
    paginated.baseUrl('/search').queryString(searchParams)

    Event.emit('search:searched', {
      term,
      totalResults: results.estimatedTotalHits,
    })

    const title = `Search by "${term}"`
    const description = `Search results for "${term} - ${results.estimatedTotalHits} videos"`
    const keywords = ['popular', 'most viewed']

    return view.render('search', {
      videos: paginated,
      title,
      description,
      keywords,
      term,
      listTitle: title,
      listSubtitle: description,
      routerName: 'web.search',
      hideFilter: true,
      hideSort: true,
    })
  }

  public async show({ view }: HttpContextContract) {
    return view.render('lust')
  }
}
