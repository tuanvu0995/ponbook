import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Limiter } from '@adonisjs/limiter/build/services'
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

    const throttleKey = `login_${uid}_${request.ip()}`
    const limiter = Limiter.use({
      requests: 10,
      duration: '15 mins',
      blockDuration: '30 mins',
    })
    if (await limiter.isBlocked(throttleKey)) {
      return response.tooManyRequests('Login attempts exhausted. Please try after some time')
    }

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
      await limiter.increment(throttleKey)
      return response.redirect().back()
    }

    if (!(await Hash.verify(user.password, password))) {
      session.flash('error', `Invalid ${isUIDAsEmail ? 'email' : 'username'} or password`)
      await limiter.increment(throttleKey)
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
