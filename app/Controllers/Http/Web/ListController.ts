import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import { CastRepo } from 'App/Repos/CastRepo'
import { DirectorRepo } from 'App/Repos/DirectorRepo'
import { MakerRepo } from 'App/Repos/MakerRepo'
import { TagRepo } from 'App/Repos/TagRepo'
import VideoRepo from 'App/Repos/VideoRepo'

export default class ListController {
  public async popular({ request, pagination, view }: HttpContextContract & HttpRequestPagination) {
    const { page = 1, limit = 36, filters } = pagination
    const videos = await VideoRepo.getPopularVideos(page, limit, filters)
    videos.baseUrl(`/popular`).queryString(request.qs())

    const title = 'Popular Videos'
    const description = 'List of all the popular videos'
    const keywords = ['popular', 'most viewed']

    return view.render('list', {
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
      routerName: 'web.list.popular',
      hideSort: true,
    })
  }

  public async recent({ request, view, pagination }: HttpContextContract & HttpRequestPagination) {
    const { page = 1, limit = 36, filters } = pagination
    const videos = await VideoRepo.getRecentVideos(page, limit, filters)
    videos.baseUrl(`/recent`).queryString(request.qs())

    const title = 'Recently Added Videos'
    const description = 'List of all the recently added videos'
    const keywords = ['recently']

    return view.render('list', {
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
      routerName: 'web.list.recent',
      hideSort: true,
    })
  }

  public async newReleases({
    request,
    pagination,
    view,
  }: HttpContextContract & HttpRequestPagination) {
    const { page = 1, limit = 36, filters } = pagination
    const videos = await VideoRepo.getNewReleaseVideos(page, limit, filters)
    videos.baseUrl(`/new-release`).queryString(request.qs())

    const title = 'New Release Videos'
    const description = 'List of all the new release videos'
    const keywords = ['new release']

    return view.render('list', {
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
      routerName: 'web.list.newRelease',
      hideSort: true,
    })
  }

  public async castsBySlug({ request, auth, view, pagination }: HttpContextContract & HttpRequestPagination) {
    const slug = request.param('slug')
    const { page = 1, limit = 36, filters, sorts } = pagination
    const cast = await CastRepo.findBySlug(slug, true)
    if (!cast) {
      return view.render('errors/not-found')
    }

    await cast.load('users', (query) => {
      query.where('user_id', auth.user!.id)
    })

    const videos = await CastRepo.getVideosByCast(cast, page, limit, filters, sorts)
    videos.baseUrl(`/a/${cast.slug}`)

    const title = cast.name
    const description = `List of all the movies that ${cast.name} has been in`
    const keywords = [cast.name]

    return view.render('cast', {
      cast,
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
      routerName: 'web.list.castBySlug',
      routerParams: { slug: cast.slug },
    })
  }

  public async director({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const { page = 1, limit = 36 } = request.qs()
    const director = await DirectorRepo.findByUid(uid)
    if (!director) {
      return view.render('errors/not-found')
    }

    const videos = await DirectorRepo.getVideosByDirector(director, page, limit)
    videos.baseUrl(`/director/${director.uid}`)

    const title = director.name
    const description = `List of all the movies that ${director.name} has been in`

    const keywords = [director.name]

    return view.render('list', {
      director,
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
      routerName: 'web.list.director',
      routerParams: { uid: director.uid },
    })
  }

  public async maker({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const { page = 1, limit = 36 } = request.qs()
    const maker = await MakerRepo.findByUid(uid)
    if (!maker) {
      return view.render('errors/not-found')
    }

    const videos = await MakerRepo.getVideosByMaker(maker, page, limit)
    videos.baseUrl(`/maker/${maker.uid}`)

    const title = maker.name
    const description = `List of all the movies ${maker.name} has been in`
    const keywords = [maker.name]

    return view.render('list', {
      maker,
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
      routerName: 'web.list.maker',
      routerParams: { uid: maker.uid },
    })
  }

  public async tag({ request, view }: HttpContextContract) {
    const slug = request.param('slug')
    const { page = 1, limit = 36 } = request.qs()
    const tag = await TagRepo.findBySlug(slug)
    if (!tag) {
      return view.render('errors/not-found')
    }

    const videos = await TagRepo.getVideosByTag(tag, page, limit)
    videos.baseUrl(`/tag/${tag.slug}`)

    const title = tag.name
    const description = `List of all the movies that ${tag.name} has been in`
    const keywords = [tag.name]

    return view.render('list', {
      tag,
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
      routerName: 'web.list.tag',
      routerParams: { slug: tag.slug },
    })
  }

  public async generes({ request, view, pagination }: HttpContextContract & HttpRequestPagination) {
    const { page = 1, limit = 36 } = pagination
    const filterName = request.qs().search

    const tags = await TagRepo.getTags(filterName, page, limit)
    tags.baseUrl(`/generes`).queryString(request.qs())

    const title = 'Generes'
    const description = 'List of all the generes'
    const keywords = ['generes']

    return view.render('generes', {
      genenes: tags,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
    })
  }

  public async actresses({
    request,
    view,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const { page = 1, limit = 36 } = pagination
    const filterName = request.qs().search

    const casts = await CastRepo.getCasts(filterName, page, limit)
    casts.baseUrl(`/actresses`).queryString(request.qs())

    const title = 'Actresses'
    const description = 'List of all the actresses'
    const keywords = ['actresses']

    return view.render('actresses', {
      actresses: casts,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
    })
  }

}
