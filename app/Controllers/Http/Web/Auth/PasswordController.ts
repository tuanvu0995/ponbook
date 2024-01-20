import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Limiter } from '@adonisjs/limiter/build/services'
import { isEmail } from 'App/Helpers/isEmail'
import UserRepo from 'App/Repos/UserRepo'
import Event from '@ioc:Adonis/Core/Event'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Route from '@ioc:Adonis/Core/Route'

export default class LoginController {
  public async forgotPassword({ view }: HttpContextContract) {
    return view.render('auth/forgot-password')
  }

  public async resetPassword({ view, params, request }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      throw new BadRequestException('Invalid reset password link.')
    }

    const signedUrl = Route.makeSignedUrl(
      'auth.postResetPassword',
      {
        uid: params.uid,
      },
      {
        expiresIn: '5m',
      }
    )

    const uid = params.uid
    return view.render('auth/reset-password', { uid, signedUrl })
  }

  public async sendResetLinkEmail({ request, session, response }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      throw new BadRequestException('Invalid reset password link.')
    }

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

  public async reset({ request, session, response }: HttpContextContract) {
    const uid = request.input('uid')
    const password = request.input('password')

    if (!uid) {
      session.flash('error', 'Invalid reset password link.')
      return response.redirect().back()
    }

    if (!password || password.length < 8 || password.length > 32) {
      session.flash('error', 'Invalid password. It must be between 8 and 32 characters.')
      return response.redirect().back()
    }

    const user = await UserRepo.findByUid(uid)
    if (!user) {
      session.flash('error', 'Invalid reset password link.')
      return response.redirect().back()
    }

    user.password = password
    await user.save()

    session.flash('success', 'Your password has been reset successfully. You can now login.')
    return response.redirect().back()
  }
}
