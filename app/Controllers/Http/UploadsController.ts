import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Comment from 'App/Models/Comment'
import Video from 'App/Models/Video'
import slugify from 'App/utils/slugify'
import uniqid from 'uniqid'
import VideoFilter from 'App/Models/VideoFilter'
import Collection from 'App/Models/Collection'
import FileService from 'App/Services/FileService'

const ACCEPT_TYPES = ['comment', 'cover', 'main']

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
      extnames: ['jpg', 'png', 'JPG', 'PNG'],
    })

    if (!image) {
      return response.json({ error: 'Image are required' })
    }

    if (!image.isValid) {
      return response.json(image.errors)
    }

    const filename = `users/images/${uniqid()}.${image.extname?.toLocaleLowerCase()}`

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

  public async videoFromBot({ request, response }: HttpContextContract) {
    const existsVideo = await Video.query().where('code', request.input('code')).first()
    if (existsVideo) {
      return response.json({ videoId: existsVideo.id })
    }

    const body = request.body()
    const video = new Video()
    video.code = body.code
    video.releaseDate = body.releaseDate
    video.duration = body.duration
    video.title = body.title
    video.description = body.description
    video.slug = body.slug
    video.userId = 1
    await video.save()

    if (body.director) {
      await video.saveDirector(video, body.director)
    }

    if (body.maker) {
      await video.saveMaker(video, body.maker)
    }

    if (body.casts) {
      await video.saveCasts(video, body.casts)
    }

    if (body.tags) {
      await video.saveTags(video, body.tags)
    }

    video.slug = slugify(video.title)

    await video.save()

    await VideoFilter.newVideoAdded(video).then(() => console.log('Video filter indexed!'))

    return response.json({ success: true, videoId: video.id })
  }

  public async imageFromBot({ request, response }: HttpContextContract) {
    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'png', 'JPG', 'PNG'],
    })

    if (!image) {
      return response.json({ error: 'Image are required' })
    }

    if (!image.isValid) {
      return response.json(image.errors)
    }

    const video = await Video.findBy('id', request.input('videoId'))
    if (!video) {
      return response.badRequest('Video not found')
    }

    const filename = `tmp/${uniqid()}.${image.extname?.toLocaleLowerCase()}`

    await image.moveToDisk('./', { name: filename })
    const path = Env.get('LOCAL_UPLOAD_PATH')

    if (request.input('type') === 'cover') {
      const file = await FileService.processFile(path + '/' + filename, 'cover')
      await video.related('videoCover').associate(file)
    } else {
      const file = await FileService.processFile(path + '/' + filename, 'cover')
      await video.related('videoImage').associate(file)
      await video.related('images').attach([file.id])
    }

    video.isPublished = true
    await video.save()

    return response.json({ imageSuccess: true })
  }

  public async codeExists({ request, response }: HttpContextContract) {
    const code = request.input('code')
    if (!code) {
      return response.badRequest('Code is required')
    }

    const existsVideo = await Video.query().where('code', code).first()
    return response.json({ exists: !!existsVideo })
  }

  public async updatePopularList({ request, response }: HttpContextContract) {
    const codes = request.input('codes')
    if (!Array.isArray(codes)) {
      return response.badRequest('Codes must be array')
    }

    const popularCollection = await Collection.query().where('slug', 'popular').first()
    if (!popularCollection) {
      return response.badRequest('Popular collection not found')
    }

    const videoIds: number[] = []
    for (const code of codes) {
      const video = await Video.query().where('code', code).first()
      if (video) {
        videoIds.push(video.id)
      }
    }

    const syncData = videoIds.map((id, index) => ({
      [id]: { order: index + 1 },
    }))
    const syncDataObject = Object.assign({}, ...syncData)

    await popularCollection.related('videos').sync(syncDataObject)
  }

  public async nextCode({ response }: HttpContextContract) {
    const video = await Video.query()
      .where('is_deleted', false)
      .where('has_torrent', false)
      .orderBy('release_date', 'desc')
      .first()

    if (!video) {
      return response.json({ code: null })
    }

    return response.json({ code: video.code })
  }
}
