import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SitemapGenerator from 'App/Services/SitemapGenerator'

let sitemap

export default class WebController {
  public async sitemap({ response }: HttpContextContract) {
    response.header('Content-Type', 'application/xml')
    if (sitemap) return response.send(sitemap)
    sitemap = await SitemapGenerator()
    return response.send(sitemap)
  }
}
