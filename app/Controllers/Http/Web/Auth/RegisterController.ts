import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Limiter } from '@adonisjs/limiter/build/services'
import UserRegisterValidator from 'App/Validators/UserRegisterValidator'
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'

export default class RegisterController {
  public async index({ view, request, session }: HttpContextContract) {
    const { redirect } = request.qs()
    if (redirect) {
      session.put('backUrl', redirect)
    }
    return view.render('auth/register')
  }

  public async register({ request, auth, response, session }: HttpContextContract) {
    const throttleKey = `register_${request.ip()}`
    const limiter = Limiter.use({
      requests: 5,
      duration: '15 mins',
      blockDuration: '1 day',
    })
    if (await limiter.isBlocked(throttleKey)) {
      session.flash('error', 'Too many register attempts. Please try again later.')
      return response.redirect().back()
    }
    const payload = await request.validate(UserRegisterValidator)

    const tracking = auth.user
    let user: User

    if (tracking && tracking.trackingId) {
      tracking.merge(payload)
      tracking.trackingId = ''
      await tracking.save()
      user = tracking
    } else {
      user = await User.create(payload)
    }

    await auth.use('web').login(user)
    await Event.emit('user:created', user)

    if (session.has('backUrl')) {
      const backUrl = session.get('backUrl')
      session.forget('backUrl')
      return response.redirect().toPath(backUrl)
    }

    return response.redirect().toRoute('web.home')
  }
}
