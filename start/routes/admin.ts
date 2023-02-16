import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {
  Route.get('/', 'DashboardController.index').as('dashboard')
  Route.resource('videos', 'VideoManagersController')
  Route.resource('users', 'UserManagersController')
  Route.resource('settings', 'SettingsController')
  Route.resource('pages', 'PagesController')
})
  .as('admin')
  .prefix('admin')
  .middleware(['auth', 'role:admin,manager'])
  .namespace('App/Controllers/Http/Admin')

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
}).middleware(['auth', 'role:admin'])
