import type { EventsList } from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import Category from 'App/Models/Category'
import Video from 'App/Models/Video'
import CategoryRepo from 'App/Repos/CategoryRepo'

export default class CategoryListender {
  public async calculate(category: EventsList['category:calculate']) {
    Logger.info('Calculate category', {
      id: category.id,
      name: category.name,
      filtyers: category.filters,
    })

    const { keywords } = category.filters || {}

    // Get all parents
    const parents = await CategoryRepo.getParents(category)

    if (Array.isArray(keywords)) {
      const videos = parents.length
        ? await this.searchVideoFromParents(parents, keywords) // Search videos from parents
        : await this.searchVideos(keywords) // Search videos from all categories

      const videoIds = videos.map((video) => video.id)
      category.related('videos').sync(videoIds) // Sync videos to this category
      Logger.info(`Calculate category ${category.id} done. ${videoIds.length} videos found`)
    }
  }

  private async searchVideoFromParents(parents: Category[], keywords: string[]): Promise<Video[]> {
    const parentIds = parents.map((parent) => parent.id)
    return await Video.query()
      .whereExists((qs) => qs.from('category_videos').whereIn('category_id', parentIds))
      .where((query) => {
        keywords.map((key) =>
          query.orWhereRaw(`title LIKE '%${key}%'`).orWhereRaw(`description LIKE '%${key}%'`)
        )
      })
  }

  private async searchVideos(keywords: string[]): Promise<Video[]> {
    return await Video.query().where((query) => {
      keywords.map((key) =>
        query.orWhereRaw(`title LIKE '%${key}%'`).orWhereRaw(`description LIKE '%${key}%'`)
      )
    })
  }
}
