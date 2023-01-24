import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRegisterValidator from 'App/Validators/UserRegisterValidator'
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'

export default class RegisterController {
  public async index({ view }: HttpContextContract) {
    return view.render('register')
  }

  public async register({ request, auth, response }: HttpContextContract) {
    const payload: any = await request.validate(UserRegisterValidator)

    const user = await User.create(payload)

    await auth.use('web').login(user)

    await Event.emit('user:created', user)

    return response.redirect().toRoute('home')
  }
}
