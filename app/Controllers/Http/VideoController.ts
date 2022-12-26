import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Cast from 'App/Models/Cast'
import Director from 'App/Models/Director'
import Maker from 'App/Models/Maker'
import Video from 'App/Models/Video'
import UpdateVideoValidator from 'App/Validators/UpdateVideoValidator'
import { nanoid } from 'nanoid'

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
    await video.load('cast')

    video.images = JSON.parse(video.images || '[]')

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
    await video.load('cast')

    return view.render('videos/edit', { video })
  }

  public async update({ request, response, params, view, session }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }

    const body = await request.validate(UpdateVideoValidator)
    console.log(body)
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

    if (body.cast) {
      let cast = await Cast.query().where('name', body.cast).first()
      if (!cast) {
        cast = new Cast()
        cast.name = body.cast
        await cast.save()
      }
      video.castId = cast.id
    }

    await video.save()

    session.flash('success', 'Video updated successfully')
    return response.redirect().toRoute('videos.edit', { uid: video.uid })
  }

  public async uploadImage({ request, response, params, view, session }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }

    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'gif'],
    })

    if (!image) {
      return
    }

    if (!image.isValid) {
      return image.errors
    }
    const filename = `images/${Date.now()}-${nanoid()}.${image.extname}`

    await image.moveToDisk('./', { name: filename })
    if (!video.image) {
      video.image = filename
    }

    let images = video.images
    if (typeof video.images === 'string') {
      images = JSON.parse(video.images)
    }

    images.push(filename)
    video.images = images

    await video.save()

    return response.json({
      image: filename,
    })
  }
}
