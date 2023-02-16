import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SettingsController {
    public async index({ view }: HttpContextContract) {
        return view.render('admin/settings/index')
    }
}
