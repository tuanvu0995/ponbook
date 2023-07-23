import Comment from 'App/Models/Comment'
import Video from 'App/Models/Video'

export default class CommentRepo {
  public static async getCommentsByVideo(video: Video, page = 1, limit = 10): Promise<any> {
    return Comment.query()
      .preload('owner')
      .where('video_id', video.id)
      .where('is_draft', false)
      .paginate(page, limit)
  }
}
