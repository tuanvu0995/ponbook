import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Page from 'App/Models/Page'
import UpdatePageValidator from 'App/Validators/UpdatePageValidator'

export default class PagesController {
  public async index({ request, view }: HttpContextContract) {
    const { page = 1, limit = 10 } = request.qs()
    const pages = await Page.query().orderBy('id', 'desc').paginate(page, limit)

    const title = 'Page management'
    const description = 'List of all pages'

    pages.baseUrl('/admin/pages')
    return view.render('admin/page/index', { title, description, pages })
  }

  public async create({ response }: HttpContextContract) {
    const page = new Page()
    page.title = 'No name page'
    page.slug = 'no-name-page'
    page.content = ''
    page.isPublished = false
    page.layout = 'default'
    await page.save()
    return response.redirect().toRoute('admin.pages.edit', { id: page.id })
  }

  public async edit({ params, view }: HttpContextContract) {
    const page = await Page.findOrFail(params.id)
    const title = 'Edit page'
    const description = 'Edit page'
    const layoutList = [
      { value: 'default', label: 'Default' },
      { value: 'full-width', label: 'Full width' },
    ]
    return view.render('admin/page/edit', { title, description, page, layoutList })
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const body = await request.validate(UpdatePageValidator)
    const page = await Page.findOrFail(params.id)

    const existingPage = await Page.query().where('slug', body.slug).whereNot('id', page.id).first()
    if (existingPage) {
      session.flash('error', 'Page with this slug already exists')
      return response.redirect().back()
    }

    page.merge(body)

    page.isPublished = request.input('isPublished') === 'on' ? true : false
    await page.save()

    session.flash('success', 'Page updated successfully')

    return response.redirect().toRoute('admin.pages.edit', { id: page.id })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const page = await Page.findOrFail(params.id)
    await page.delete()
    session.flash('success', 'Page deleted successfully')
    return response.redirect().toRoute('admin.pages.index')
  }
}
