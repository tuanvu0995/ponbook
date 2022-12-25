import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator'

export default class PasswordController {
  public async changePassword({ request, response, auth }: HttpContextContract) {
    const { oldPassword, password } = await request.validate(ChangePasswordValidator)

    const user = await auth.user
    if (!user || !(await Hash.verify(user.password, oldPassword))) {
      return response.unauthorized('Invalid credentials')
    }

    user.password = password
    await user.save()

    return response.json({
      status: true,
      message: 'Password changed successfully.',
    })
  }
}
