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

  public async update({ request, response, params }: HttpContextContract) {
    const post = await Post.query().where('uid', params.uid).firstOrFail()
    post.merge(request.only(['title', 'content']))
    await post.save()
    return response.redirect().toRoute('posts.edit', { uid: post.uid })
  }
}
