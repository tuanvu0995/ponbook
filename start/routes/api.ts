import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/searches', 'SearchesController.searches').as('searches')
  Route.get('/searches/:searchId', 'SearchesController.getSearch').as('search:get')

  Route.get('/models', 'ModelsController.getModel').as('models:get')

  Route.resource('videos', 'VideosController')
})
  .as('api')
  .prefix('api')
