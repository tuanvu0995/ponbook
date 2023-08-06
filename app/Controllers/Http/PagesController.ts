import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import PageRepo from 'App/Repos/PageRepo'

export default class PagesController {
  public async getPageFromSlug({ params, response }: HttpContextContract) {
    const { slug } = params
    const page = await PageRepo.findBySlug(slug)

    if (!page) {
      throw new NotFoundException('Page not found')
    }

    return response.json(page)
  }
}
