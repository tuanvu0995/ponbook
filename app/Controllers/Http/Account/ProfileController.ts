import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateProfileValidator from '../../../Validators/UpdateProfileValidator'

export default class ProfileController {
  public async getProfile({ response, auth }: HttpContextContract) {
    const user = await auth.user

    if (!user) {
      return response.unauthorized('Invalid credentials')
    }

    return response.json({
      status: true,
      message: 'Profile fetched successfully.',
      data: user.serialize({
        fields: {
          omit: ['id', 'created_at', 'updated_at'],
        },
      }),
    })
  }

  public async updateProfile(ctx: HttpContextContract) {
    const { request, response, auth } = ctx
    const user = await auth.user

    if (!user) {
      return response.unauthorized('Invalid credentials')
    }

    const payload: any = await request.validate(UpdateProfileValidator)

    user.merge(payload)
    await user.save()

    return response.json({
      status: true,
      message: 'Profile update successfully.',
    })
  }
}
