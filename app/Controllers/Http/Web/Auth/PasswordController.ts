import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Limiter } from '@adonisjs/limiter/build/services'
import { isEmail } from 'App/Helpers/isEmail'
import UserRepo from 'App/Repos/UserRepo'
import Event from '@ioc:Adonis/Core/Event'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class LoginController {
  public async forgotPassword({ view }: HttpContextContract) {
    return view.render('auth/forgot-password')
  }

  public async resetPassword({ view, params, request }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      throw new BadRequestException('Invalid reset password link.')
    }
    return view.render('auth/reset-password', { uid: params.uid })
  }

  public async sendResetLinkEmail({ request, session, response }: HttpContextContract) {
    const throttleKey = `request-reset-link${request.ip()}`
    const limiter = Limiter.use({
      requests: 5,
      duration: '15 mins',
      blockDuration: '15 mins',
    })
    if (await limiter.isBlocked(throttleKey)) {
      session.flash('error', 'Too many request attempts. Please try again later.')
      return response.redirect().back()
    }

    const email = request.input('email')

    if (!isEmail(email)) {
      session.flash('error', 'Invalid email address.')
      return response.redirect().back()
    }

    const user = await UserRepo.findByEmail(email)
    if (user) {
      Event.emit('user:request-reset-link', user)
    }

    session.flash(
      'success',
      `We have emailed your password reset link to ${email}. Please check your inbox.`
    )

    return response.redirect().back()
  }

  public async reset({ request, session, params, response }: HttpContextContract) {
    const password = request.input('password')

    if (!password || password.length < 8 || password.length > 32) {
      session.flash('error', 'Invalid password. It must be between 8 and 32 characters.')
      return response.redirect().back()
    }

    const user = await UserRepo.findByUid(params.uid)
    if (!user) {
      throw new BadRequestException('Invalid reset password link.')
    }

    user.password = password
    await user.save()

    session.flash('success', 'Your password has been reset successfully. You can now login.')
    return response.redirect().toRoute('auth.login')
  }
}
