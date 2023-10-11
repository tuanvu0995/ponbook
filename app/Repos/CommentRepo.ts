import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { CreateCommentInput } from 'App/Domain/CommentDto'
import Comment from 'App/Models/Comment'
import Video from 'App/Models/Video'

export default class CommentRepo {
  public static async getCommentsByVideo(video: Video, page = 1, limit = 30): Promise<any> {
    return Comment.query()
      .preload('user')
      .where('video_id', video.id)
      .whereNull('parent_id')
      .where('isPublished', true)
      .paginate(page, limit)
  }

  public static async getCommentsByParent(parent: Comment, page = 1, limit = 10): Promise<any> {
    return Comment.query()
      .preload('user')
      .where('parent_id', parent.id)
      .where('isPublished', true)
      .paginate(page, limit)
  }

  public static async getCommentByUid(uid: string): Promise<Comment | null> {
    return await Comment.query().where('uid', uid).where('isPublished', true).first()
  }

  public static async createComment(input: CreateCommentInput) {
    return await Comment.create(input)
  }

  public static async deleteComment(comment: Comment) {
    await comment.delete()
  }

  public static async updateComment(comment: Comment, input: { content: string }) {
    const trimBody = input.content.trim()
    const cleanText = sanitizeHtml(marked.parse(trimBody))
    comment.htmlContent = cleanText
    comment.content = trimBody
    await comment.save()
    return comment
  }
}
