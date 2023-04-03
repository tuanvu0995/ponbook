import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Video from 'App/Models/Video'
import VideoRepository from 'App/Repositories/VideoRepository'
import UpdateVideoValidator from 'App/Validators/UpdateVideoValidator'

export default class VideosController {
  public async upsetVideo({ request, response }: HttpContextContract) {
    const code = request.input('code')?.trim()?.toUpperCase()
    if (!code) throw new BadRequestException('Code is required')

    const payload = await request.validate(UpdateVideoValidator)

    const existsVideo = await VideoRepository.getVideoByCode(code, true)
    if (existsVideo) {
      await this.updateVideo(existsVideo, payload)
      return response.status(200).send({ message: 'Updated' })
    }

    const video = new Video()
    video.code = code
    video.userId = 1
    await this.updateVideo(video, request.all())
    return response.status(201).send({ message: 'Created' })
  }

  private async updateVideo(video: Video, payload: any) {
    const { casts, tags, maker, director, cover, image, images, ...rest } = payload
    video.merge(rest)
    await video.save()

    if (_.isArray(casts)) {
      const castArray = casts.map((item) => item.trim())
      await video.saveCasts(video, castArray)
    }
    if (_.isArray(tags)) {
      const tagsArray = tags.map((item) => item.trim())
      await video.saveTags(video, tagsArray)
    }
    if (!_.isNil(maker)) await video.saveMaker(video, maker)
    if (!_.isNil(director)) await video.saveDirector(video, director)

    if (_.isArray(images)) await video.saveImages(video, images)

    if (!_.isNil(cover)) await video.saveCover(video, cover)
    if (!_.isNil(image)) await video.saveImage(video, image)

    await video.publish(video)
  }
}
