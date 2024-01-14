import Route from '@ioc:Adonis/Core/Route'

/*
|--------------------------------------------------------------------------
| Search Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('/suggestions', 'SearchController.suggestions').as('suggestions')
})
  .as('api.search')
  .namespace('App/Controllers/Http/Api')
  .prefix('api/search')

/*
|--------------------------------------------------------------------------
| Job Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('/reindex', 'JobController.reindex').as('reindex')
})
  .as('api.jobs')
  .namespace('App/Controllers/Http/Api')
  .prefix('api/jobs')
