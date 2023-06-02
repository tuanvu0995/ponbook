import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRegisterValidator from 'App/Validators/UserRegisterValidator'
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'

export default class RegisterController {
  public async index({ view, request, session }: HttpContextContract) {
    const { redirect } = request.qs()
    if (redirect) {
      session.put('backUrl', redirect)
    }
    return view.render('register')
  }

  public async register({ request, auth, response, session }: HttpContextContract) {
    const payload: any = await request.validate(UserRegisterValidator)

    const user = await User.create(payload)
    await auth.use('web').login(user)

    await Event.emit('user:created', user)

    if (session.has('backUrl')) {
      const backUrl = session.get('backUrl')
      session.forget('backUrl')
      return response.redirect().toPath(backUrl)
    }

    return response.redirect().toRoute('home')
  }
}
