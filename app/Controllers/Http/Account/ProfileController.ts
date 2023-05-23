import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator'
import UpdateProfileValidator from '../../../Validators/UpdateProfileValidator'

export default class ProfileController {
  public async profile({ view, auth }: HttpContextContract) {
    const user = await auth.user
    return view.render('account/profile', { user })
  }

  public async update({ request, response, auth, session }: HttpContextContract) {
    const user = await auth.user!

    const payload: any = await request.validate(UpdateProfileValidator)
    console.log(payload)

    user.merge(payload)
    await user.save()

    session.flash('success', 'Profile updated successfully')

    return response.redirect().toRoute('account.account')
  }

  public async password({ view }: HttpContextContract) {
    return view.render('account/password')
  }

  public async changePassword({ request, response, auth, session }: HttpContextContract) {
    const body = await request.validate(ChangePasswordValidator)

    const user = await auth.authenticate()

    if (!(await Hash.verify(user.password, body.password))) {
      session.flash('error', 'Invalid password')
      return response.redirect().back()
    }

    user.password = body.newPassword
    await user.save()

    session.flash('success', 'Password have been changed successfully')
    return response.redirect().toRoute('account.password')
  }
}
