import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Limiter } from '@adonisjs/limiter/build/services'
import Hash from '@ioc:Adonis/Core/Hash'
import Event from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'
import TooManyRequestException from 'App/Exceptions/TooManyRequestException'
import BadRequestException from 'App/Exceptions/BadRequestException'
import UserRegisterValidator from 'App/Validators/UserRegisterValidator'
import { isEmail } from 'App/Helpers/isEmail'

export default class AuthController {
  private getThrottleKey(uid: string, ip: string) {
    return `login_${uid}_${ip}`
  }

  public async signIn({ request, response, auth }: HttpContextContract) {
    const uid = request.input('uid')
    const password = request.input('password')
    const rememberMe = request.input('rememberMe')

    const isUIDAsEmail = isEmail(uid)

    const throttleKey = this.getThrottleKey(uid, request.ip())
    const limiter = Limiter.use({
      requests: 10,
      duration: '15 mins',
      blockDuration: '30 mins',
    })
    if (await limiter.isBlocked(throttleKey)) {
      throw new TooManyRequestException('Login attempts exhausted. Please try after some time')
    }

    const user = await User.query()
      .where((query) => {
        isUIDAsEmail ? query.where('email', uid) : query.where('username', uid)
      })
      .where('is_deleted', false)
      .first()

    if (!user) {
      await limiter.increment(throttleKey)
      throw new BadRequestException(`Invalid ${isUIDAsEmail ? 'email' : 'username'} or password`)
    }

    if (!(await Hash.verify(user.password, password))) {
      await limiter.increment(throttleKey)
      throw new BadRequestException(`Invalid ${isUIDAsEmail ? 'email' : 'username'} or password`)
    }

    const token = await auth.use('api').generate(user, {
      expiresIn: rememberMe ? '30 days' : '1 day',
    })

    return response.json(token)
  }

  public async signUp({ request, response, auth }: HttpContextContract) {
    const payload: any = await request.validate(UserRegisterValidator)
    const user = await User.create({
      username: payload.username?.toLowerCase(),
      email: payload.email,
      password: payload.password,
    })

    Event.emit('user:created', user)

    const token = await auth.use('api').generate(user, {
      expiresIn: '30 days',
    })

    return response.json(token)
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').logout()
    return response.json({ message: 'Logout successfully' })
  }

  public async me({ auth, response }: HttpContextContract) {
    const user = auth.use('api').user!
    return response.json(user)
  }
}
