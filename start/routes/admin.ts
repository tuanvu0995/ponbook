import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {
  Route.get('/', 'DashboardController.index').as('dashboard')
  Route.resource('videos', 'VideoManagersController')
  Route.resource('users', 'UserManagersController')
  Route.resource('pages', 'PagesController')

  Route.get('settings/information', 'SettingsController.information').as('settings.information')

  Route.get('settings/sitemap', 'SettingsController.sitemap').as('settings.sitemap')
  Route.post('settings/sitemap/generate', 'SettingsController.generateSitemap').as(
    'settings.generateSitemap'
  )

  Route.get('settings/robots', 'SettingsController.robots').as('settings.robots')
  Route.post('settings/robots/save', 'SettingsController.saveRobot').as('settings.saveRobot')

  Route.get('settings', ({ response }) =>
    response.redirect().toRoute('admin.settings.information')
  ).as('settings.index')
})
  .as('admin')
  .prefix('admin')
  .middleware(['auth', 'role:admin,manager'])
  .namespace('App/Controllers/Http/Admin')

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
}).middleware(['auth', 'role:admin'])
