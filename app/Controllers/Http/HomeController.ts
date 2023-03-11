import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CollectionRepository from 'App/Repositories/CollectionRepository'
import VideoRepository from 'App/Repositories/VideoRepository'

export default class HomeController {
  protected videoRepository: VideoRepository
  protected collectionRepository: CollectionRepository

  constructor() {
    this.videoRepository = new VideoRepository()
    this.collectionRepository = new CollectionRepository()
  }

  public async index({ view }: HttpContextContract) {
    const collections = await this.collectionRepository.getHomeCollections()
    const newlyUpdatedVideos = await this.videoRepository.getNewlyUpdatedVideos()
    const recentVideos = await this.videoRepository.getRecentVideos()
    return view.render('index', { collections, newlyUpdatedVideos, posts: [], recentVideos })
  }
}
