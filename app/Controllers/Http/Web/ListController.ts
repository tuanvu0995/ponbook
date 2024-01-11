import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CastRepo } from 'App/Repos/CastRepo'
import { DirectorRepo } from 'App/Repos/DirectorRepo'
import { MakerRepo } from 'App/Repos/MakerRepo'
import { TagRepo } from 'App/Repos/TagRepo'
import VideoRepo from 'App/Repos/VideoRepo'

export default class ListController {

  public async popular({ request, view }: HttpContextContract) {
    const { page = 1, limit = 36 } = request.qs()
    const videos = await VideoRepo.getPopularVideos(page, limit)
    videos.baseUrl(`/popular`)

    const title = 'Popular Videos'
    const description = 'List of all the popular videos'
    const keywords = ['popular', "most viewed"]

    return view.render('list', {
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
    })
  }

  public async recent({ request, view }: HttpContextContract) {
    const { page = 1, limit = 36 } = request.qs()
    const videos = await VideoRepo.getRecentVideos(page, limit)
    videos.baseUrl(`/recent`)

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
    })
  }

  public async newReleases({ request, view }: HttpContextContract) {
    const { page = 1, limit = 36 } = request.qs()
    const videos = await VideoRepo.getNewReleaseVideos(page, limit)
    videos.baseUrl(`/new-releases`)

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
    })
  }


  public async castsBySlug({ request, view }: HttpContextContract) {
    const slug = request.param('slug')
    const { page = 1, limit = 36 } = request.qs()
    const cast = await CastRepo.findBySlug(slug)
    if (!cast) {
      return view.render('errors/not-found')
    }

    const videos = await CastRepo.getVideosByCast(cast, page, limit)
    videos.baseUrl(`/a/${cast.slug}`)

    const title = cast.name
    const description = `List of all the movies that ${cast.name} has been in`
    const keywords = [cast.name]

    return view.render('list', {
      cast,
      videos,
      title,
      description,
      keywords,
      listTitle: title,
      listSubtitle: description,
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
    })
  }
}
