import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cache from '@ioc:Adonis/Addons/Cache'
import { CacheTimes } from 'Config/constants'
import TagRepository from 'App/Repositories/TagRepository'

export default class TagController {
  public async getRandomTags({ response }: HttpContextContract) {
    console.log('TagController.getRandomTags')
    const tags = await Cache.remember(
      'home_tags',
      CacheTimes.A_DAY,
      async () => await TagRepository.getRandomTags()
    )

    return response.json(tags)
  }
}
