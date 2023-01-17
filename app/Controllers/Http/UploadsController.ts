import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import { nanoid } from 'nanoid'

const ACCEPT_TYPES = ['comment']

export default class UploadsController {
  public async uploadImage({ request, response, auth }: HttpContextContract) {
    const user = await auth.authenticate()

    const type = request.input('type')
    const videoId = request.input('videoId')
    if (!ACCEPT_TYPES.includes(type)) {
      return response.badRequest('Invalid type')
    }

    if (!videoId) {
      return response.badRequest('Video id is required')
    }

    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'png', 'gif', 'JPG', 'PNG', 'GIF'],
    })

    if (!image) {
      return response.json({ error: 'Image are required' })
    }

    if (!image.isValid) {
      return response.json(image.errors)
    }

    const filename = `users/images/${nanoid()}.${image.extname?.toLocaleLowerCase()}`

    await image.moveToDisk('./', { name: filename })

    let relatedModel: any = null
    if (type === 'comment') {
      relatedModel = await Comment.query()
        .where('video_id', videoId)
        .where('user_id', user.id)
        .where('is_draft', true)
        .first()
      if (!relatedModel) {
        relatedModel = await Comment.create({
          userId: user.id,
          content: '',
          videoId: videoId,
          attachmentImages: '[]',
        })
      } else {
      }
    }

    const images = JSON.parse(relatedModel.attachmentImages || '[]')
    images.push(filename)
    relatedModel.attachmentImages = JSON.stringify(images)
    await relatedModel.save()

    return response.json({
      image: filename,
    })
  }
}
