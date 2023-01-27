import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostController {
  public async create({ response, auth }: HttpContextContract) {
    const user = auth.user!
    let post = await user
      .related('posts')
      .query()
      .where('is_published', false)
      .where('is_draft', true)
      .first()

    if (!post) {
      post = await Post.create({ userId: user.id, title: 'No name post', content: '' })
    }

    return response.redirect().toRoute('posts.edit', { uid: post.uid })
  }

  public async edit({ view, params }: HttpContextContract) {
    const post = await Post.query().where('uid', params.uid).firstOrFail()
    return view.render('posts/edit', { post })
  }

  public async update({ request, response, params, session }: HttpContextContract) {
    const post = await Post.query().where('uid', params.uid).firstOrFail()
    post.merge(request.only(['title', 'content']))
    console.log(request.input('published'))

    const published = request.input('published')

    post.isPublished = Boolean(published && published === 'on')
    post.isDraft = !post.isPublished

    await post.save()

    session.flash('success', 'Post updated successfully')

    return response.redirect().toRoute('posts.edit', { uid: post.uid })
  }

  public async vote({ request, response, params, auth }: HttpContextContract) {
    const post = await Post.query().where('uid', params.uid).firstOrFail()
    const user = auth.user!
    const vote = request.input('vote')

    if (!['up', 'down'].includes(vote)) {
      return response.json({ success: false, message: 'Invalid vote' })
    }

    const votedPost = await user
      .related('votedPosts')
      .query()
      .pivotColumns(['is_upvote', 'is_downvote'])
      .where('post_id', post.id)
      .first()
    if (!votedPost) {
      await user.related('votedPosts').attach({
        [post.id]: { is_upvote: vote === 'up', is_downvote: vote === 'down' },
      })
      if (vote === 'up') post.voteUpCount += 1
      if (vote === 'down') post.voteDownCount += 1
      await post.save()
      return response.json({
        success: true,
        message: 'Vote this post success',
        vote,
        voteUpCount: post.voteUpCount,
        voteDownCount: post.voteDownCount,
      })
    }

    console.log(votedPost.$extras)

    if (
      Boolean(votedPost.$extras.pivot_is_upvote) === (vote === 'up') ||
      Boolean(votedPost.$extras.pivot_is_downvote) === (vote === 'down')
    ) {
      await user.related('votedPosts').detach([post.id])
      if (vote === 'up') post.voteUpCount -= 1
      if (vote === 'down') post.voteDownCount -= 1
    } else {
      await user.related('votedPosts').sync(
        {
          [post.id]: {
            is_upvote: vote === 'up',
            is_downvote: vote === 'down',
          },
        },
        false
      )

      if (vote === 'up') {
        post.voteUpCount += 1
        post.voteDownCount -= 1
      } else {
        post.voteUpCount -= 1
        post.voteDownCount += 1
      }
    }

    if (post.voteUpCount < 0) post.voteUpCount = 0
    if (post.voteDownCount < 0) post.voteDownCount = 0

    await post.save()

    return response.json({
      success: true,
      message: 'Vote this post success',
      vote,
      voteUpCount: post.voteUpCount,
      voteDownCount: post.voteDownCount,
    })
  }
}
