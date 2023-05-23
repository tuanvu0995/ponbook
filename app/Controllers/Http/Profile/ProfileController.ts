import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRepository from 'App/Repositories/UserRepository'

export default class ProfileController {
  public async index({ view, request, auth }: HttpContextContract) {
    const uid = request.param('uid')
    const profile = await UserRepository.findByUid(uid)
    const user = auth.user

    const isMe = user?.uid === uid

    const title = `${profile?.username} `
    const description = profile.bio || `Profile of ${profile.firstName || profile.username}`

    return view.render('profile/profile', { title, description, profile, user, isMe })
  }
}
