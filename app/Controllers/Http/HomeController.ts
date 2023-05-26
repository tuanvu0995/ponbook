import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Tag from 'App/Models/Tag'
import BoxRepository from 'App/Repositories/BoxRepository'
import CollectionRepository from 'App/Repositories/CollectionRepository'
import VideoRepository from 'App/Repositories/VideoRepository'
import { VIEWED_LIST } from 'Config/contants'

export default class HomeController {
  protected videoRepository: VideoRepository
  protected collectionRepository: CollectionRepository

  constructor() {
    this.videoRepository = new VideoRepository()
    this.collectionRepository = new CollectionRepository()
  }

  public async index({ view, session }: HttpContextContract) {
    const collections = await this.collectionRepository.getHomeCollections()
    const newlyUpdatedVideos = await this.videoRepository.getNewlyUpdatedVideos()
    const recentVideos = await this.videoRepository.getRecentVideos()
    const tags = await Tag.getRandomTags()

    const viewedIds = JSON.parse(session.get(VIEWED_LIST, '[]'))
    const viewedVideos = await VideoRepository.getVideoByIds(viewedIds)

    const boxes = await BoxRepository.getTop3Boxes()

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
