import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

export default class Role {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, guards?: string[]) {
    const groupNames = Array.isArray(guards) ? guards : []

    const user = auth.user
    if (!user) throw new UnauthorizedException()

    const foundGroup = await user.related('groups').query().whereIn('slug', groupNames).first()
    if (!foundGroup) throw new UnauthorizedException()

    await next()
  }
}
