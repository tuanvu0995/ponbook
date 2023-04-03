import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/videos', 'VideosController.upsetVideo').as('upset:video')
})
  .as('api:worker')
  .prefix('api/worker')
  .middleware('workerAuth')
  .namespace('App/Controllers/Http/Worker')
