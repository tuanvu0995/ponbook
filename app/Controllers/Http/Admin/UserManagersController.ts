import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserManagersController {
  public async index({ request, view }: HttpContextContract) {
    const { page = 1, perPage = 20 } = request.qs()

    const users = await User.query().orderBy('id', 'desc').paginate(page, perPage)

    users.baseUrl(`/admin/users`)

    return view.render('admin/user/index', { users })
  }
}
