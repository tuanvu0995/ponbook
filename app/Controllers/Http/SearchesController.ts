import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SearchRepository from 'App/Repositories/SearchRespositoy'

export default class SearchesController {
  public async searches({ request, response }: HttpContextContract) {
    const keyword = request.input('keyword')
    if (!keyword) {
      return response.badRequest({ message: 'Keyword is required' })
    }

    const videos = await SearchRepository.searchVideos(keyword)
    const casts = await SearchRepository.searchCasts(keyword)
    const tags = await SearchRepository.searchTags(keyword)

    const videoResults = videos.map((video) => ({
      id: video.id,
      title: video.title,
    }))

    const castResults = casts.map((cast) => ({
      id: cast.id,
      name: cast.name,
      slug: cast.slug,
    }))

    const tagResults = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    }))

    return response.json({ videos: videoResults, casts: castResults, tags: tagResults })
  }

  // public async getSearch({ request, response }: HttpContextContract) {}
}
