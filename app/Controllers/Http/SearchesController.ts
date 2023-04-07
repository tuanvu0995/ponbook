import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SearchRepository from 'App/Repositories/SearchRespositoy'
import _ from 'lodash'

export default class SearchesController {
  public async searches({ request, response }: HttpContextContract) {
    const keyword = request.input('keyword')
    if (!keyword || keyword.length < 2) {
      return {
        videos: [],
        casts: [],
        tags: [],
      }
    }

    const videos = await SearchRepository.searchVideos(keyword)
    const casts = await SearchRepository.searchCasts(keyword)
    const tags = await SearchRepository.searchTags(keyword)

    const videoResults = videos.map((video) => ({
      id: video.id,
      title: video.title,
      uid: video.uid,
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

  // public async getSearch({ request, response }: HttpContextContract) {}
}
