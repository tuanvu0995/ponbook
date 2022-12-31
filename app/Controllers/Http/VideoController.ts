import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Cast from 'App/Models/Cast'
import Director from 'App/Models/Director'
import Maker from 'App/Models/Maker'
import Video from 'App/Models/Video'
import UpdateVideoValidator from 'App/Validators/UpdateVideoValidator'
import { nanoid } from 'nanoid'
import Tag from 'App/Models/Tag'

export default class VideoController {
  public async index({ view }: HttpContextContract) {
    return view.render('videos/index')
  }

  public async show({ params, view }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }

    await video.load('director')
    await video.load('maker')
    await video.load('casts')
    await video.load('tags')

    // @ts-ignore
    await video.preloadImages({ includeGalleries: true })

    return view.render('videos/show', { video })
  }

  public async create({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()

    let video = await Video.query().where('user_id', user.id).where('is_draft', true).first()
    if (!video) {
      video = new Video()
      video.title = 'Untitled video'
      video.userId = user.id
      await video.save()
    }

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

    const { cast, casts, tag, tags, ...body } = await request.validate(UpdateVideoValidator)
    video.merge({
      ...body,
      isPublished: body.isPublished === 'on',
      isDraft: body.isPublished !== 'on',
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
      extnames: ['jpg', 'png', 'gif'],
    })

    if (!image) {
      return response.json({ error: 'Image are required' })
    }

    if (!image.isValid) {
      return response.json(image.errors)
    }

    const filename = `images/${Date.now()}-${nanoid()}.${image.extname}`

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
      tag.slug = tagInput
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
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
    await video.related('tags').detach()
    await video.related('casts').detach()
    await video.delete()

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
}
