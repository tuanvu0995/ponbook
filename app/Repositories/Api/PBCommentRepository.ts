import _ from 'lodash'
import Comment from 'App/Models/Comment'
import PBVideoRepository from './PBVideoRepository'

export default class PBCommentRepository {
  public static async getCommentsByVideo(uid: string, limit: number = 15, page: number = 1) {
    console.log('getCommentsByVideo', uid)
    const video = await PBVideoRepository.getVideoByUid(uid, true)
    const comments = await Comment.query()
      .preload('owner')
      .where('video_id', video.id)
      .where('is_blocked', false)
      .where('is_draft', false)
      .paginate(page, limit)

    return comments
  }
}
