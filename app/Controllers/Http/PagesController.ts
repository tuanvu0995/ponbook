import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PageRepo from 'App/Repos/PageRepo'

export default class PagesController {
  public async getPageFromSlug({ params, response }: HttpContextContract) {
    const { slug } = params
    const page = await PageRepo.findBySlug(slug)
    return response.json(page)
  }
}
