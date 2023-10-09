import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MeiliSearch from '@ioc:MeiliSearch'
import Event from '@ioc:Adonis/Core/Event'
import Video from 'App/Models/Video'
import SearchRepo from 'App/Repos/SearchRepo'

export default class SearchesController {
  public async search({ request, response }: HttpContextContract) {
    const keyword = request.input('keyword')
    if (!keyword || keyword.length < 2) {
      return {
        videos: [],
        casts: [],
        tags: [],
      }
    }

    const videos = await SearchRepo.search(keyword)
    const casts = await SearchRepo.searchCasts(keyword)
    const tags = await SearchRepo.searchTags(keyword)

    const videoResults = videos.map((video) => ({
      title: video.title,
      uid: video.uid,
    }))

    const castResults = casts.map((cast) => ({
      name: cast.name,
      slug: cast.slug,
    }))

    const tagResults = tags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    }))

    // take total 10 results
    const total = videoResults.length + castResults.length + tagResults.length
    if (total > 10) {
      if (videoResults.length > 5) {
        videoResults.splice(5, videoResults.length - 5)
      }

      if (castResults.length > 5) {
        castResults.splice(5, castResults.length - 5)
      }

      if (tagResults.length > 5) {
        tagResults.splice(5, tagResults.length - 5)
      }
    }

    return response.json({ videos: videoResults, casts: castResults, tags: tagResults })
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
