import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Limiter } from '@adonisjs/limiter/build/services'
import Hash from '@ioc:Adonis/Core/Hash'
import Event from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'
import TooManyRequestException from 'App/Exceptions/TooManyRequestException'
import BadRequestException from 'App/Exceptions/BadRequestException'
import UserRegisterValidator from 'App/Validators/UserRegisterValidator'
import { isEmail } from 'App/Helpers/isEmail'
import { HttpRequestPagination } from '@ioc:Contracts'

export default class AuthController {
  private getThrottleKey(uid: string, ip: string) {
    return `login_${uid}_${ip}`
  }

  public async signIn({ request, response, auth }: HttpContextContract) {
    const uid = request.input('uid')
    const password = request.input('password')
    const rememberMe = request.input('rememberMe')

    if (!uid) {
      throw new BadRequestException('Please provide a valid email or username')
    }

    if (!password) {
      throw new BadRequestException('Please provide a valid password')
    }

    const uidIsEmail = isEmail(uid)

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
        uidIsEmail ? query.where('email', uid) : query.where('username', uid)
      })
      .where('is_deleted', false)
      .first()

    if (!user) {
      await limiter.increment(throttleKey)
      throw new BadRequestException(`Invalid ${uidIsEmail ? 'email' : 'username'} or password`)
    }

    if (!(await Hash.verify(user.password, password))) {
      await limiter.increment(throttleKey)
      throw new BadRequestException(`Invalid ${uidIsEmail ? 'email' : 'username'} or password`)
    }

    const token = await auth.use('api').generate(user, {
      expiresIn: rememberMe ? '90 days' : '30 day',
    })

    return response.json(token)
  }

  public async signUp({ request, response, auth }: HttpContextContract) {
    const payload: any = await request.validate(UserRegisterValidator)
    const user = await User.create({
      username: payload.username?.toLowerCase(),
      email: payload.email,
      password: payload.password,
      totalPoints: 0,
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

  public async myFavorites({
    auth,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const user = auth.use('api').user!

    const videos = await user
      .related('favoriteVideos')
      .query()
      .preload('cover')
      .preload('casts')
      .where('is_deleted', false)
      .where('is_published', true)
      .paginate(pagination.page, pagination.limit)

    return response.json(videos)
  }

  public async batchAddFavorite({ auth, response, request }: HttpContextContract) {
    const user = auth.use('api').user!

    const uids = request.input('uids', [])

    const notExistVideos = await user
      .related('favoriteVideos')
      .query()
      .whereNotIn('uid', uids)
      .where('is_deleted', false)
      .where('is_published', true)

    await user.related('favoriteVideos').attach(notExistVideos.map((video) => video.id))

    return response.json({
      message: 'Add to favorite successfully',
    })
  }
}
