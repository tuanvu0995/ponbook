import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Logger from '@ioc:Adonis/Core/Logger'
import UpdateVideoValidator from 'App/Validators/UpdateVideoValidator'
import Video from 'App/Models/Video'
import File from 'App/Models/File'
import Cast from 'App/Models/Cast'
import Director from 'App/Models/Director'
import Maker from 'App/Models/Maker'
import Tag from 'App/Models/Tag'

type VideoImage = {
  path: string
  data: string
  size: number
  width: number
  height: number
  type: string
}

export default class DataSourcesController {
  public async upset({ request, response }: HttpContextContract) {
    const code = request.input('code')
    if (!code) throw new BadRequestException('code is required')

    Logger.info(`---------> Upset video: ${code}`)

    const payload = await request.validate(UpdateVideoValidator)

    payload.title = payload.title.replace(code, '').trim()

    const existsVideo = await Video.query().where('code', code).first()
    if (existsVideo) {
      Logger.info(`---------> Video exists => update video: ${code}`)
      await this.updateVideo(existsVideo, payload)

      return response.status(201).send({ message: 'Updated' })
    }

    Logger.info(`---------> Video not exists => create video: ${code}`)
    const video = new Video()
    video.code = code
    video.userId = 1
    await this.updateVideo(video, payload)
    return response.status(201).send({ message: 'Created' })
  }

  private async updateVideo(video: Video, payload: any) {
    const { casts, tags, maker, director, cover, image, images, updateBySite, ...rest } = payload
    video.merge(rest)
    await video.save()

    if (video.coverFileId && video.imageFileId && video.updatedBy?.includes(updateBySite)) {
      Logger.info(`---------> ${video.code}: video is already update`)
      return
    }

    if (updateBySite) {
      if (!video.updatedBy) {
        video.updatedBy = updateBySite
      } else {
        const arr = video.updatedBy.split(',')
        video.updatedBy = _.uniq([...arr, updateBySite]).join(',')
      }
    }
    await video.save()

    if (_.isArray(casts)) {
      const castArray = casts.map((item) => item.trim())
      await this.saveCasts(video, castArray)
    }
    if (_.isArray(tags)) {
      const tagsArray = tags.map((item) => item.trim())
      await this.saveTags(video, tagsArray)
    }
    if (!_.isNil(maker)) await this.saveMaker(video, maker)
    if (!_.isNil(director)) await this.saveDirector(video, director)

    if (_.isArray(images)) await this.saveImages(video, images)

    if (!_.isNil(cover)) await this.saveCover(video, cover)
    if (!_.isNil(image)) await this.saveImage(video, image)

    await video.publish(video)
    Logger.info(`---------> ${video.code}: video is updated`)

    return video
  }

  public async saveDirector(video: Video, director: string) {
    let d = await Director.query().where('name', director).first()
    if (!d) {
      d = new Director()
      d.name = director
      await d.save()
    }
    video.directorId = d.id
  }

  public async saveMaker(video: Video, maker: string) {
    let m = await Maker.query().where('name', maker).first()
    if (!m) {
      m = new Maker()
      m.name = maker
      await m.save()
    }
    video.makerId = m.id
  }

  private async saveImages(video: Video, images: VideoImage[]) {
    const imageIds = await Promise.all(
      images.map(async (image) => {
        const file = new File()
        file.fill(image)
        await file.save()
        return file.id
      })
    )

    await video.related('images').sync(imageIds)
  }

  public async saveTags(video: Video, tags: string[]) {
    const tagIds = await Promise.all(
      tags.map(async (tag) => {
        const tagModel = await Tag.firstOrCreate({ name: tag }, { name: tag })
        return tagModel.id
      })
    )
    await video.related('tags').sync(tagIds)
  }

  private async saveCasts(video: Video, casts: string[]) {
    const castIds = await Promise.all(
      casts.map(async (cast) => {
        const existsCast = await Cast.getCastByName(cast)
        if (existsCast) {
          return existsCast.id
        } else {
          const castModel = await Cast.create({ name: cast })
          return castModel.id
        }
      })
    )
    await video.related('casts').sync(castIds)
  }

  private async saveCover(video: Video, cover: VideoImage) {
    const file = new File()
    file.fill(cover)
    await file.save()
    await video.related('cover').associate(file)
  }

  private async saveImage(video: Video, image: VideoImage) {
    const file = new File()
    file.fill(image)
    await file.save()
    await video.related('image').associate(file)
  }
}
