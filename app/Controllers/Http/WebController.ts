import { extname } from 'path'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import SitemapGenerator from 'App/Services/SitemapGenerator'
import VideoFilter from 'App/Models/VideoFilter'
import Video from 'App/Models/Video'
import Page from 'App/Models/Page'

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

  public async postSearch({ request, response }: HttpContextContract) {
    const keyword = request.input('keyword')?.trim()
    if (!keyword || keyword.length <= 2) return response.redirect().back()

    const key = keyword.toLowerCase()
    const existsFilter = await VideoFilter.query().where('key', key).first()
    if (existsFilter) {
      return response.redirect().toRoute('web.search', { searchId: existsFilter.uid })
    }

    const videos = await Video.query()
      .whereRaw('LOWER(code) LIKE LOWER(?)', [`%${key}%`])
      .whereRaw('LOWER(title) LIKE LOWER(?)', [`%${key}%`])
      .orWhereHas('casts', (query) => {
        query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${key}%`])
      })
      .where('is_published', true)
      .orderBy('release_date', 'desc')
      .select('id', 'release_date')

    const videoIds = videos.map((video) => video.id)

    const videoFilter = new VideoFilter()
    videoFilter.key = keyword
    await videoFilter.save()

    await videoFilter.related('videos').attach(videoIds)

    return response.redirect().toRoute('web.search', { searchId: videoFilter.uid })
  }

  public async search({ request, params, view, response }: HttpContextContract) {
    const { page = 1, perPage = 30 } = request.qs()
    const videoFilter = await VideoFilter.query().where('uid', params.searchId).firstOrFail()

    const videos = await Video.query()
      .innerJoin('video_filter_videos as vfv', 'vfv.video_id', 'videos.id')
      .where('vfv.video_filter_id', videoFilter.id)
      .where('is_published', true)
      .preload('casts')
      .orderBy('code', 'desc')
      .paginate(page, perPage)

    if (videos.length === 1) {
      return response.redirect().toRoute('videos.show', { uid: videos[0].uid })
    }

    videos.baseUrl(`/search/${params.searchId}`)
    const title = `Search: ${videoFilter.key}`

    return view.render('search', { videos, videoFilter, title })
  }

  public async page({ request, view }: HttpContextContract) {
    const slug = request.param('slug')
    if (!slug) return view.render('errors.not-found')

    const page = await Page.query().where('slug', slug).where('is_published', true).first()
    if (!page) return view.render('errors.not-found')

    const layout = page.layout || 'default'

    return view.render('layouts/' + layout, { page })
  }
}
