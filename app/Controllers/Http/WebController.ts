import { extname } from 'path'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import SitemapGenerator from 'App/Services/SitemapGenerator'

let sitemap

export default class WebController {
  public async sitemap({ response }: HttpContextContract) {
    response.header('Content-Type', 'application/xml')
    if (sitemap) return response.send(sitemap)
    sitemap = await SitemapGenerator()
    return response.send(sitemap)
  }

  public async image({ request, response }: HttpContextContract) {
    const location = `/images/${request.param('path')}`

    const { size } = await Drive.getStats(location)

    response.type(extname(location))
    response.header('content-length', size)

    return response.stream(await Drive.getStream(location))
  }
}
