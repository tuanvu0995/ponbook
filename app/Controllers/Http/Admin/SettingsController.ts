import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SettingsController {
  public async information({ view }: HttpContextContract) {
    return view.render('admin/settings/information')
  }
}
