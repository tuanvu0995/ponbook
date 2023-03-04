import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Director from 'App/Models/Director'
import Maker from 'App/Models/Maker'
import Video from 'App/Models/Video'
import UpdateVideoValidator from 'App/Validators/UpdateVideoValidator'
import { nanoid } from 'nanoid'
import Tag from 'App/Models/Tag'
import slugify from 'App/utils/slugify'

export default class VideoController {
  public async index({ view }: HttpContextContract) {
    return view.render('videos/index')
  }

  public async show({ params, view, auth }: HttpContextContract) {
    const { page = 1, limit = 20 } = params
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }

    await video.load('torrents', (qs) => qs.orderBy('seed', 'desc'))
    await video.load('director')
    await video.load('maker')
    await video.load('casts')
    await video.load('tags')
    const comments = await video
      .related('comments')
      .query()
      .where('is_draft', false)
      .preload('owner')
      .paginate(page, limit)

    comments.baseUrl('/videos/' + video.uid)

    // @ts-ignore
    await video.preloadImages({ includeGalleries: true })

    const tagIds = video.tags.map((tag) => tag.id)
    const relatedVideos = await Video.query()
      .preload('casts')
      .innerJoin('video_tags', 'videos.id', 'video_tags.video_id')
      .whereIn('video_tags.tag_id', tagIds)
      .where('videos.id', '!=', video.id)
      .groupBy('videos.id')
      .limit(6)

    const keyword = [
      video.code,
      ...video.casts.map((cast) => cast.name),
      ...video.tags.map((tag) => tag.name),
    ].join(', ')

    let isFavorite = false
    if (auth.user) {
      const favorite = await auth.user.related('favorites').query().where('video_id', video.id)
      isFavorite = favorite.length > 0
    }

    const castNames = video.casts.map((cast) => cast.name).join(', ')

    let title = video.code
    if (castNames) title += ` - ${castNames}`
    const description = video.description
    const metaImage = video.image

    return view.render('videos/show', {
      title,
      description,
      metaImage,
      video,
      comments,
      relatedVideos,
      keyword,
      isFavorite,
    })
  }

  public async create({ response, auth }: HttpContextContract) {
    const user = auth.user!

    let video = await Video.query().where('user_id', user.id).where('is_published', false).first()
    console.log(video)
    if (!video || video.isPublished) {
      video = new Video()
      video.title = 'Untitled video'
      video.slug = slugify(video.title)
      video.userId = user.id
      await video.save()
    }

    console.log('video', video.uid)
    return response.redirect().toRoute('videos.edit', { uid: video.uid })
  }

  public async edit({ params, view }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }

    await video.load('director')
    await video.load('maker')
    await video.load('casts')
    await video.load('tags')

    await video.preloadImages({ includeGalleries: true })

    return view.render('videos/edit', { video })
  }

  public async update({ request, response, params, view, session }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }

    const { cast, casts, tag, tags, published, ...body } = await request.validate(
      UpdateVideoValidator
    )
    video.merge({
      ...body,
      isPublished: published === 'on',
      isDraft: published !== 'on',
    })

    if (body.director) {
      let director = await Director.query().where('name', body.director).first()
      if (!director) {
        director = new Director()
        director.name = body.director
        await director.save()
      }
      video.directorId = director.id
    }

    if (body.maker) {
      let maker = await Maker.query().where('name', body.maker).first()
      if (!maker) {
        maker = new Maker()
        maker.name = body.maker
        await maker.save()
      }
      video.makerId = maker.id
    }

    if (typeof casts !== 'undefined') {
      let castArray = casts.map((item) => item.trim())
      await video.saveCasts(video, castArray)
    }

    if (typeof cast !== 'undefined') {
      let castArray = cast.split(',').map((item) => item.trim())
      await video.saveCasts(video, castArray)
    }

    if (typeof tags !== 'undefined') {
      let tagsArray = tags.map((item) => item.trim())
      await video.saveTags(video, tagsArray)
    }

    if (typeof tag !== 'undefined') {
      let tagsArray = tag.split(',').map((item) => item.trim())
      await video.saveTags(video, tagsArray)
    }

    video.slug = slugify(video.title)

    const newImages: string[] = []
    if (video.$dirty.slug !== video.$original.slug) {
      const images = JSON.parse(video.images || '[]')
      for (const image of images) {
        const newImageName = image.replace(video.$original.slug, video.slug)
        if (newImageName !== image) {
          await Drive.move(image, newImageName)
        }
        newImages.push(newImageName)
      }

      video.image = newImages[0]
      video.images = JSON.stringify(newImages)
    }

    await video.save()

    session.flash('success', 'Video updated successfully')
    return response.redirect().toRoute('videos.edit', { uid: video.uid })
  }

  public async uploadImage({ request, response, params, view }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return view.render('errors/not-found')
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

    const filename = `images/${video.slug}-${nanoid()}.${image.extname}`

    await image.moveToDisk('./', { name: filename })

    if (!video.image) {
      video.image = filename
    }

    const images = JSON.parse(video.images || '[]')
    images.push(filename)
    video.images = JSON.stringify(images)

    await video.save()

    return response.json({
      image: await Drive.getSignedUrl(filename),
    })
  }

  public async addTag({ request, response, params }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return response.json({
        error: 'Video not found',
      })
    }

    const tagInput: string = request.input('tag')?.trim()

    if (!tagInput) {
      return response.json({
        error: 'Tag is required',
      })
    }

    let tag = await Tag.query().where('slug', tagInput).first()
    if (!tag) {
      tag = new Tag()
      tag.name = tagInput
      await tag.save()
      await video.related('tags').attach([tag.id])
    } else {
      if (!(await video.related('tags').query().where('id', tag.id).first())) {
        await video.related('tags').attach([tag.id])
      }
    }

    return response.json({
      success: true,
      data: tag,
    })
  }

  public async delete({ request, view }: HttpContextContract) {
    const uid = request.param('uid')
    const video = await Video.query().where('uid', uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }
    return view.render('videos/delete', { video })
  }

  public async destroy({ request, view, response }: HttpContextContract) {
    const uid = request.param('uid')
    const video = await Video.query().where('uid', uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }
    video.isDeleted = true
    await video.save()

    return response.redirect().toRoute('home')
  }

  public async deleteImage({ request, response }: HttpContextContract) {
    const uid = request.param('uid')
    const imagePath = request.input('image')
    const video = await Video.query().where('uid', uid).first()
    if (!video) {
      return response.json({
        error: 'Video not found',
      })
    }

    if (imagePath.includes(video.image)) {
      video.image = ''
    }

    let images = JSON.parse(video.images || '[]')

    images = images.filter((image) => !imagePath.includes(image))
    video.images = JSON.stringify(images)

    await video.save()

    try {
      await Drive.delete(imagePath)
    } catch (error) {
      console.log('Error when delete image: ', error)
    }

    return response.json({
      success: true,
    })
  }

  public async setVideoImage({ request, response, auth }: HttpContextContract) {
    const uid = request.param('uid')
    const imagePath = request.input('image')
    const toType = request.input('toType')

    const user = auth.user!

    if (!['cover', 'image'].includes(toType)) {
      return response.badRequest("toType must be 'cover' or 'image'")
    }

    if (!imagePath) {
      return response.badRequest('Image path is required')
    }

    const video = await Video.query().where('uid', uid).where('user_id', user.id).first()
    if (!video) {
      return response.json({
        error: 'Video not found',
      })
    }
    if (imagePath.startsWith('/uploads')) {
      video[toType] = imagePath.replace('/uploads', '')
    } else {
      video[toType] = imagePath
    }

    await video.save()

    return response.json({
      success: true,
    })
  }

  public async favorite({ request, response, auth }: HttpContextContract) {
    const uid = request.param('uid')
    const video = await Video.query().where('uid', uid).first()
    if (!video) {
      return response.json({
        error: 'Video not found',
      })
    }

    const user = auth.user!
    let state = 'added'

    if (await user.related('favorites').query().where('video_id', video.id).first()) {
      await user.related('favorites').detach([video.id])
      state = 'removed'
    } else {
      await user.related('favorites').attach([video.id])
    }

    return response.json({
      success: true,
      state,
      message: 'Video ' + state + ' to favorites',
    })
  }
}
