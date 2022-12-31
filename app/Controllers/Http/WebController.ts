import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
const { Readable } = require('stream')

let sitemap

export default class WebController {
  public async sitemap({ request, response }: HttpContextContract) {
    response.header('Content-Type', 'application/xml')
    response.header('Content-Encoding', 'gzip')

    if (sitemap) return response.send(sitemap)

    const smStream = new SitemapStream({ hostname: 'https://ponbook.net' })
    const pipeline = smStream.pipe(createGzip())
  }
}
