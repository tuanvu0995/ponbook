import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MeiliSearch from '@ioc:MeiliSearch'
import Event from '@ioc:Adonis/Core/Event'
import Video from 'App/Models/Video'
import SearchRepo from 'App/Repos/SearchRepo'

export default class SearchController {
  public async suggestions({ request, response }: HttpContextContract) {
    const keyword = request.input('keyword') || ''

    const suggestions = await SearchRepo.getSuggestions(keyword)

    return response.json({
      suggestions: suggestions.map((suggestion) => ({
        term: suggestion.term,
        totalResults: suggestion.totalResults,
      })),
    })
  }

  public async atSearch({ request, response }: HttpContextContract) {
    const keyword = request.input('keyword')
    if (!keyword || keyword.length < 2) {
      return []
    }

    const searchResult = await MeiliSearch.search('videos', keyword.toLowerCase(), {
      limit: 30,
    })

    const videoIds = searchResult.hits.map((hit) => hit.id)
    searchResult.hits = await Video.query()
      .whereIn('id', videoIds)
      .preload('cover')
      .preload('casts')

    return response.json(searchResult)
  }

  public async indexing({ response }: HttpContextContract) {
    Event.emit('search:indexing', undefined)
    return response.status(200).json({
      message: 'Indexing',
    })
  }
}
