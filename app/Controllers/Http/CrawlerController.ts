import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Crawler from 'App/Services/Crawler'

export default class CrawlerController {
  public async crawl({ request, response }: HttpContextContract) {
    const url = request.input('url')

    const crawl = new Crawler()
    const videoData = await crawl.crawl(url)
    console.log('Added video', videoData)
    const video = await crawl.addVideo(videoData)

    return response.json(video)
  }
}
