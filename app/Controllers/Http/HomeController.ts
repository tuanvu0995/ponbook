import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cache from '@ioc:Adonis/Addons/Cache'
import BoxRepository from 'App/Repositories/BoxRepository'
import CollectionRepository from 'App/Repositories/CollectionRepository'
import VideoRepository from 'App/Repositories/VideoRepository'
import { CacheTimes, VIEWED_LIST } from 'Config/constants'
import TagRepository from 'App/Repositories/TagRepository'

export default class HomeController {
  public async index({ view, session }: HttpContextContract) {
    const collections = await Cache.remember(
      'home_collections',
      CacheTimes.A_DAY,
      async () => await CollectionRepository.getHomeCollections()
    )
    const newlyUpdatedVideos = await Cache.remember(
      'newly_updated_videos',
      CacheTimes.A_DAY,
      async () => await VideoRepository.getNewlyUpdatedVideos()
    )
    const recentVideos = await Cache.remember(
      'recent_videos',
      CacheTimes.A_DAY,
      async () => await VideoRepository.getRecentVideos()
    )

    const tags = await Cache.remember(
      'home_tags',
      CacheTimes.A_DAY,
      async () => await TagRepository.getRandomTags()
    )

    const viewedIds = JSON.parse(session.get(VIEWED_LIST, '[]'))
    const viewedVideos = await VideoRepository.getVideoByIds(viewedIds)

    const boxes = await Cache.remember(
      'top_3_boxes',
      CacheTimes.A_DAY,
      async () => await BoxRepository.getTop3Boxes()
    )

    return view.render('index', {
      collections,
      newlyUpdatedVideos,
      posts: [],
      recentVideos,
      tags,
      viewedVideos,
      boxes,
    })
  }
}
