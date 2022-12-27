import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import { isEmail } from 'App/utils/isEmail'

export default class LoginController {
  public async index({ view }: HttpContextContract) {
    return view.render('login')
  }

  public async login({ request, auth, session, response }: HttpContextContract) {
    const uid = request.input('uid')
    const password = request.input('password')
    const rememberMe = request.input('remember_me')

    const isUIDAsEmail = isEmail(uid)

    const user = await User.query()
      .where((query) => {
        if (isUIDAsEmail) {
          query.where('email', uid)
        } else {
          query.where('username', uid)
        }
      })
      .where('is_deleted', false)
      .first()

    if (!user) {
      session.flash('error', `Invalid ${isUIDAsEmail ? 'email' : 'username'} or password`)
      return response.redirect().back()
    }

    if (!(await Hash.verify(user.password, password))) {
      session.flash('error', `Invalid ${isUIDAsEmail ? 'email' : 'username'} or password`)
      return response.redirect().back()
    }

    await auth.use('web').login(user, rememberMe === 'on')

    return response.redirect().toRoute('home')
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.redirect().toRoute('home')
  }
}
