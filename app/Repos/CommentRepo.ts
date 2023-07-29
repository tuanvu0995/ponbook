import { CreateCommentInput } from 'App/Domain/CommentDto'
import Comment from 'App/Models/Comment'
import Video from 'App/Models/Video'
import VideoRepo from './VideoRepo'

export default class CommentRepo {
  public static async getCommentsByVideo(video: Video, page = 1, limit = 10): Promise<any> {
    return Comment.query()
      .preload('owner')
      .where('video_id', video.id)
      .where('is_draft', false)
      .paginate(page, limit)
  }

  public static async getCommentByUid(uid: string): Promise<Comment | null> {
    return await Comment.query().where('uid', uid).first()
  }

  public static async createComment(input: CreateCommentInput) {
    return await Comment.create(input)
  }

  public static async deleteComment(comment: Comment) {
    await comment.delete()
  }
}
