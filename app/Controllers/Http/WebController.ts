import { extname } from 'path'
import axios from 'axios'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import VideoFilter from 'App/Models/VideoFilter'
import Video from 'App/Models/Video'
import Page from 'App/Models/Page'
import SearchRepository from 'App/Repositories/SearchRespositoy'
import NotFoundException from 'App/Exceptions/NotFoundException'

export default class WebController {
  public async image({ request, response }: HttpContextContract) {
    const location = `/images/${request.param('path')}`

    const { size } = await Drive.getStats(location)

    response.type(extname(location))
    response.header('content-length', size)

    return response.stream(await Drive.getStream(location))
  }

  public async postSearch({ request, response, session }: HttpContextContract) {
    const keyword = request.input('keyword')?.trim()
    if (!keyword || keyword.length < 2) return response.redirect().back()

    const cat = request.input('cat')?.trim()
    if (!['code', 'title', 'idol'].includes(cat)) {
      return response.redirect().back()
    }

    session.put('search_cat', cat)
    session.put('search_keyword', keyword)

    let videoFilter: VideoFilter | null = null
    if (cat === 'code') {
      videoFilter = await SearchRepository.searchVideosByCode(keyword)
    } else if (cat === 'title') {
      videoFilter = await SearchRepository.searchVideosByTitle(keyword)
    } else if (cat === 'idol') {
      videoFilter = await SearchRepository.searchVideosByCast(keyword)
    }

    if (!videoFilter) {
      throw new NotFoundException('Search Not found')
    }

    if (!keyword || keyword.length <= 5) return response.redirect().back()
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

  public async popLink({ response }: HttpContextContract) {
    const rsp = await axios.get(
      'https://js.juicyads.com/jp.php?c=34d4z213p254u4q2w2c4z2a474&u=https%3A%2F%2Fwww.liquidfire.mobi%2Fredirect%3Fsl%3D16%26t%3Ddr%26track%3D185704_286256%26siteid%3D286256'
    )

    response.header('content-type', 'text/javascript')
    return response.send(rsp.data)
  }
}
