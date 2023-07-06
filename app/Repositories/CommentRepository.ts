import Comment from 'App/Models/Comment'

export default class CommentRepository {
  public static async getCommentByVideoId(videoId: number, page: number = 1, limit: number = 10) {
    const comments = await Comment.query()
      .preload('owner')
      .where('video_id', videoId)
      .where('is_draft', false)
      .whereNull('parent_id')
      .paginate(page, limit)

    return comments
  }
}
