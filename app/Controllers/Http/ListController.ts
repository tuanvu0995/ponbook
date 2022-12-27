import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cast from 'App/Models/Cast'
import Director from 'App/Models/Director'
import Maker from 'App/Models/Maker'

export default class ListController {
  public async cast({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const { page = 1, limit = 30 } = request.qs()
    const cast = await Cast.query().where('uid', uid).first()
    if (!cast) {
      return view.render('errors/404')
    }

    const videos = await cast
      .related('videos')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const title = cast.name
    const description = `List of all the movies and tv shows that ${cast.name} has been in`

    return view.render('cast', { cast, videos, title, description })
  }

  public async director({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const { page = 1, limit = 30 } = request.qs()
    const director = await Director.query().where('uid', uid).first()
    if (!director) {
      return view.render('errors/404')
    }

    const videos = await director
      .related('videos')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const title = director.name
    const description = `List of all the movies and tv shows that ${director.name} has been in`

    return view.render('director', { director, videos, title, description })
  }

  public async maker({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const { page = 1, limit = 30 } = request.qs()
    const maker = await Maker.query().where('uid', uid).first()
    if (!maker) {
      return view.render('errors/404')
    }

    const videos = await maker
      .related('videos')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const title = maker.name
    const description = `List of all the movies and tv shows that ${maker.name} has been in`

    return view.render('maker', { maker, videos, title, description })
  }
}
