import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PBVideoRepository from 'App/Repositories/Api/PBVideoRepository'

export default class VideoController {
  public async show({ params, response }: HttpContextContract) {
    const video = await PBVideoRepository.getVideoByUid(params.uid)
    return response.json(video)
  }
}
