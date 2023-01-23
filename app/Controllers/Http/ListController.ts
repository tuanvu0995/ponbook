import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cast from 'App/Models/Cast'
import Collection from 'App/Models/Collection'
import Director from 'App/Models/Director'
import Maker from 'App/Models/Maker'
import Tag from 'App/Models/Tag'
import Video from 'App/Models/Video'

export default class ListController {
  public async popular({ request, view }: HttpContextContract) {
    const { page = 1, limit = 30 } = request.qs()
    const popularCollection = await Collection.findByOrFail('slug', 'popular')
    const videos = await popularCollection
      .related('videos')
      .query()
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('id', 'desc')
      .paginate(page, limit)

    const title = 'Popular Videos'
    const description = 'List of the most popular videos'

    videos.baseUrl('/popular')

    for (const video of videos) {
      await video.preloadImages()
    }

    const keyword = 'popular porn videos'

    return view.render('popular', { videos, title, description, keyword })
  }

  public async newRelease({ request, view }: HttpContextContract) {
    const { page = 1, limit = 30 } = request.qs()
    const videos = await Video.query()
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)

    const title = 'New Release Videos'
    const description = 'List of video that have been recently released'

    videos.baseUrl('/new-release')

    for (const video of videos) {
      await video.preloadImages()
    }

    const keyword = 'New release porn videos'

    return view.render('newRelease', { videos, title, description, keyword })
  }

  public async recent({ request, view }: HttpContextContract) {
    const { page = 1, limit = 30 } = request.qs()
    const videos = await Video.query()
      .where('is_published', true)
      .where('is_deleted', false)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const title = 'Recently Added Videos'
    const description = 'List of video that have been added'

    videos.baseUrl('/recent')

    for (const video of videos) {
      await video.preloadImages()
    }

    const keyword = 'Recently added videos'

    return view.render('recent', { videos, title, description, keyword })
  }

  public async newComments({ request, view }: HttpContextContract) {
    const { page = 1, limit = 30 } = request.qs()
    const videos = await Video.query()
      .innerJoin('comments', 'videos.id', 'comments.video_id')
      .where('is_published', true)
      .where('comments.is_blocked', false)
      .where('comments.is_draft', false)
      .where('videos.is_deleted', false)
      .orderBy('videos.updated_at', 'desc')
      .groupBy('videos.id')
      .select('videos.*')
      .paginate(page, limit)

    const title = 'New Comments'
    const description = 'List of video that have new comments'

    videos.baseUrl('/new-comments')
    for (const video of videos) {
      await video.preloadImages()
    }

    const keyword = 'New comments'

    return view.render('recent', { videos, title, description, keyword })
  }

  public async cast({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const { page = 1, limit = 30 } = request.qs()
    const cast = await Cast.query().where('uid', uid).first()
    if (!cast) {
      return view.render('errors/not-found')
    }

    const videos = await cast
      .related('videos')
      .query()
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)

    const title = cast.name
    const description = `List of all the movies that ${cast.name} has been in`

    videos.baseUrl(`/cast/${cast.uid}`)

    for (const video of videos) {
      await video.preloadImages()
    }

    const keyword = cast.name

    return view.render('cast', { cast, videos, title, description, keyword })
  }

  public async director({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const { page = 1, limit = 30 } = request.qs()
    const director = await Director.query().where('uid', uid).first()
    if (!director) {
      return view.render('errors/not-found')
    }

    const videos = await director
      .related('videos')
      .query()
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)

    const title = director.name
    const description = `List of all the movies that ${director.name} has been in`

    videos.baseUrl(`/director/${director.uid}`)

    for (const video of videos) {
      await video.preloadImages()
    }

    const keyword = director.name

    return view.render('director', { director, videos, title, description, keyword })
  }

  public async maker({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const { page = 1, limit = 30 } = request.qs()
    const maker = await Maker.query().where('uid', uid).first()
    if (!maker) {
      return view.render('errors/not-found')
    }

    const videos = await maker
      .related('videos')
      .query()
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)

    const title = maker.name
    const description = `List of all the movies ${maker.name} has been in`

    videos.baseUrl(`/maker/${maker.uid}`)

    for (const video of videos) {
      await video.preloadImages()
    }

    const keyword = maker.name

    return view.render('maker', { maker, videos, title, description, keyword })
  }

  public async tags({ request, view }: HttpContextContract) {
    const slug = request.param('slug')
    const { page = 1, limit = 30 } = request.qs()
    const tag = await Tag.query().where('slug', slug).first()
    if (!tag) {
      return view.render('errors/not-found')
    }

    const videos = await tag
      .related('videos')
      .query()
      .where('is_deleted', false)
      .orderBy('release_date', 'desc')
      .paginate(page, limit)

    const title = tag.name
    const description = `List of all the movies that ${tag.name} has been in`

    videos.baseUrl(`/tag/${tag.slug}`)

    for (const video of videos) {
      await video.preloadImages()
    }

    const keyword = tag.name

    return view.render('tag', { tag, videos, title, description, keyword })
  }

  public async stars({ request, view }: HttpContextContract) {
    const { page = 1, limit = 30 } = request.qs()
    const casts = await Cast.query().orderBy('name', 'asc').paginate(page, limit)

    const title = 'Stars list'
    const description = `List of all av actresses`

    casts.baseUrl(`/stars`)

    return view.render('stars', { casts, title, description })
  }
}
