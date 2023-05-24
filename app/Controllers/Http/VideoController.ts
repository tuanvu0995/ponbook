import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Video from 'App/Models/Video'
import VideoRepository from 'App/Repositories/VideoRepository'
import Comment from 'App/Models/Comment'
import { MAX_VIEWED_LIST, VIEWED_LIST } from 'Config/contants'
import PBVideoRepository from 'App/Repositories/Api/PBVideoRepository'
import NotFoundException from 'App/Exceptions/NotFoundException'
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class VideoController {
  protected videoRepository: VideoRepository

  constructor() {
    this.videoRepository = new VideoRepository()
  }

  public async index({ view }: HttpContextContract) {
    return view.render('videos/index')
  }

  public async show({ request, params, view, auth, session }: HttpContextContract) {
    const { page = 1, limit = 20 } = request.qs()

    const video = await PBVideoRepository.getVideoByUid(params.uid)
    const relatedVideos = await this.videoRepository.getRelatedVideos(video)
    const comments = await Comment.getCommentsByVideo(video, page, limit)

    const keyword = [
      video.code,
      ...video.casts.map((cast) => cast.name),
      ...video.tags.map((tag) => tag.name),
    ].join(', ')

    let isFavorite = false
    if (auth.user) {
      const favorite = await auth.user.related('favoriteVideos').query().where('video_id', video.id)
      isFavorite = favorite.length > 0
    }

    const castNames = video.casts.map((cast) => cast.name).join(', ')

    let title = `${video.code}`
    if (castNames) title += ` - ${castNames}`
    const description = video.description
    const metaImage = video.image

    const viewedIds = JSON.parse(session.get(VIEWED_LIST, '[]'))
    if (!_.includes(viewedIds, video.id)) {
      if (viewedIds.length > MAX_VIEWED_LIST) {
        viewedIds.shift()
      }
      viewedIds.unshift(video.id)
      session.put(VIEWED_LIST, JSON.stringify(viewedIds))
    }
    const viewedVideos = await VideoRepository.getVideoByIds(viewedIds)

    return view.render('videos/show', {
      title,
      description,
      metaImage,
      video,
      comments,
      relatedVideos,
      keyword,
      isFavorite,
      viewedVideos,
    })
  }

  public async favorite({ request, response, auth }: HttpContextContract) {
    const uid = request.param('uid')
    const video = await Video.query().where('uid', uid).first()
    if (!video) {
      throw new NotFoundException(`Video with uid ${uid} not found`)
    }

    const user = auth.user!
    let state = 'added'

    if (await user.related('favoriteVideos').query().where('video_id', video.id).first()) {
      await user.related('favoriteVideos').detach([video.id])
      state = 'removed'
    } else {
      await user.related('favoriteVideos').attach([video.id])
    }

    return response.json({
      success: true,
      state,
      message: 'Video ' + state + ' to favorites',
    })
  }

  public async getFavoriteStatusByVideos({ request, auth, response }) {
    const videoUids = request.input('videoUids')
    await validator.validate({
      schema: schema.create({
        videoUids: schema.array().members(schema.string()),
      }),
      data: {
        videoUids,
      },
    })

    const user = auth.user!
    const videoIds = await Video.query().whereIn('uid', videoUids).select('id', 'uid')
    const favoriteIds = await Database.from('favorite_videos')
      .where('user_id', user.id)
      .whereIn(
        'video_id',
        videoIds.map((item) => item.id)
      )
      .select('video_id')

    const favoriteVideoIds = favoriteIds.map((item) => item.video_id)

    const results = _.map(videoUids, (uid) => {
      const video = _.find(videoIds, (item) => item.uid === uid)
      return {
        uid,
        isFavorite: favoriteVideoIds.includes(video?.id),
      }
    })

    return response.json(results)
  }
}
