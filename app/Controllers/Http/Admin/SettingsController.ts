import * as fs from 'fs'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SitemapGenerator from 'App/Services/SitemapGenerator'
import Application from '@ioc:Adonis/Core/Application'

export default class SettingsController {
  public async information({ view }: HttpContextContract) {
    return view.render('admin/settings/information')
  }
  public async sitemap({ view }: HttpContextContract) {
    return view.render('admin/settings/sitemap')
  }

  public async generateSitemap({ response, session }: HttpContextContract) {
    const sitemap = await SitemapGenerator()
    const sitemapPath = Application.publicPath('sitemap.xml')
    fs.writeFileSync(sitemapPath, sitemap)

    session.flash('success', 'Sitemap has been generated')
    return response.redirect().toRoute('admin.settings.sitemap')
  }
}
