import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

export default class Role {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, guards?: string[]) {
    const roleNames = Array.isArray(guards) ? guards : []

    const user = auth.user
    if (!user) throw new UnauthorizedException()

    const roles = await user.related('roles').query().whereIn('slug', roleNames).first()
    if (!roles) throw new UnauthorizedException()

    await next()
  }
}
