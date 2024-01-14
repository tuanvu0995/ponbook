import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /*
|--------------------------------------------------------------------------
| Search Routes
|--------------------------------------------------------------------------
*/
  Route.group(() => {
    Route.post('/suggestions', 'SearchController.suggestions').as('suggestions')
  })
    .as('search')
    .prefix('search')
})
  .prefix('api')
  .as('api')
  .namespace('App/Controllers/Http/Api')
