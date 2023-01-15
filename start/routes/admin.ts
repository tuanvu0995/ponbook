import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DashboardController.index').as('dashboard')
  Route.resource('videos', 'VideoManagersController')
  Route.resource('users', 'UserManagersController')
})
  .as('admin')
  .prefix('admin')
  .middleware(['auth', 'role:admin,manager'])
  .namespace('App/Controllers/Http/Admin')
