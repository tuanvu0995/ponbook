import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TagController {
  public async getRandomTags({ response }: HttpContextContract) {
    return response.json({})
  }
}
