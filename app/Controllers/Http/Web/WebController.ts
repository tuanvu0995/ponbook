import { extname } from 'path'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Page from 'App/Models/Page'

export default class WebController {
  public async live({ view }: HttpContextContract) {
    return view.render('live', { title: 'Random Live' })
  }

  public async image({ request, response }: HttpContextContract) {
    const location = `/images/${request.param('path')}`

    const { size } = await Drive.getStats(location)

    response.type(extname(location))
    response.header('content-length', size)

    return response.stream(await Drive.getStream(location))
  }

  public async page({ request, view }: HttpContextContract) {
    const slug = request.param('slug')
    if (!slug) return view.render('errors/not-found')

    const page = await Page.query().where('slug', slug).where('is_published', true).first()
    if (!page) return view.render('errors/not-found')

    const layout = page.layout || 'default'

    return view.render('layouts/' + layout, { page })
  }

  public async contact({ request, view }: HttpContextContract) {
    const page = await Page.query().where('slug', 'contact').where('is_published', true).first()
    if (!page) return view.render('errors/not-found')

    const { subject } = request.qs()
    return view.render('contact', { page, subject })
  }
}
