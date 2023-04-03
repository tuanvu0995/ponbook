import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Director from 'App/Models/Director'
import Maker from 'App/Models/Maker'
import Video from 'App/Models/Video'
import UpdateVideoValidator from 'App/Validators/UpdateVideoValidator'
import Tag from 'App/Models/Tag'
import slugify from 'App/utils/slugify'
import VideoRepository from 'App/Repositories/VideoRepository'
import Comment from 'App/Models/Comment'

export default class VideoController {
  protected videoRepository: VideoRepository

  constructor() {
    this.videoRepository = new VideoRepository()
  }

  public async index({ view }: HttpContextContract) {
    return view.render('videos/index')
  }

  public async show({ request, params, view, auth }: HttpContextContract) {
    const { uid } = params
    const { page = 1, limit = 20 } = request.qs()

    const video = await this.videoRepository.getVideoByUid(uid)
    const relatedVideos = await this.videoRepository.getRelatedVideos(video)
    const comments = await Comment.getCommentsByVideo(video, page, limit)

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
    if (!video || video.isPublished) {
      video = new Video()
      video.title = 'Untitled video'
      video.slug = slugify(video.title)
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
    await video.load('videoCover')
    await video.load('videoImage')

    await video.load('images')

    return view.render('videos/edit', { video })
  }

  public async update({ request, response, params, view, session }: HttpContextContract) {
    const video = await Video.query().where('uid', params.uid).first()
    if (!video) {
      return view.render('errors/not-found')
    }
    const cast = ''
    const tag = ''
    const { casts, tags, published, ...body } = await request.validate(UpdateVideoValidator)
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

    await video.save()

    session.flash('success', 'Video updated successfully')
    return response.redirect().toRoute('videos.edit', { uid: video.uid })
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
    const video = await Video.query().where('uid', uid).first()
    if (!video) {
      return response.json({
        error: 'Video not found',
      })
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
