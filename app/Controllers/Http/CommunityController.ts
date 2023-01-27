import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Post from 'App/Models/Post'

export default class CommunityController {
  public async feed({ request, view }: HttpContextContract) {
    const { page = 1, perPage = 15 } = request.qs()

    const posts = await Post.query()
      .preload('user')
      .where('is_published', true)
      .where('is_deleted', false)
      .paginate(page, perPage)

    return view.render('community/feed', { posts })
  }

  public async postDetail({ params, view }: HttpContextContract) {
    const post = await Post.query()
      .where('uid', params.uid)
      .where('is_published', true)
      .where('is_deleted', false)
      .first()
    if (!post) return view.render('errors/not-found')

    await post.load('user')
    const comments = await post
      .related('comments')
      .query()
      .preload('owner')
      .whereNull('parent_id')
      .where('is_blocked', false)
      .orderBy('id', 'asc')
      .paginate(1, 15)

    for (const comment of comments) {
      await comment.load('replies', (query) =>
        query.preload('owner').where('is_blocked', false).orderBy('id', 'asc')
      )
    }

    const title = post.title
    const description = post.content

    return view.render('community/post-detail', { post, comments, title, description })
  }

  public async postComment({ request, view, response, auth, params }: HttpContextContract) {
    const post = await Post.query()
      .where('uid', params.uid)
      .where('is_published', true)
      .where('is_deleted', false)
      .first()
    if (!post) return view.render('errors/not-found')

    const content = request.input('content', '')

    if (!content || content.length === 0)
      return response.redirect().toRoute('community.post:detail', { uid: post.uid })

    const parent = request.input('parent', '')
    let parentId: number = 0
    if (parent) {
      const parentComment = await post
        .related('comments')
        .query()
        .where('uid', parent)
        .where('is_blocked', false)
        .first()
      if (!parentComment)
        return response.redirect().toRoute('community.post:detail', { uid: post.uid })

      if (parentComment.parentId) {
        parentId = parentComment.parentId
      } else {
        parentId = parentComment.id
      }
    }

    const newComment = new Comment()
    newComment.postId = post.id
    newComment.userId = auth.user!.id
    newComment.content = content
    newComment.isApproved = true
    newComment.isDraft = false
    newComment.attachmentImages = ''

    if (parentId) newComment.parentId = parentId

    await newComment.save()

    post.commentsCount += 1
    await post.save()

    return response.redirect().toRoute('community.post:detail', { uid: post.uid })
  }
}
