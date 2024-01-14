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

  /*
|--------------------------------------------------------------------------
| Video Routes
|--------------------------------------------------------------------------
*/
  Route.group(() => {
    Route.post('/by-code', 'VideoController.getVideoByCode').as('videos.byCode')
  })
    .as('videos')
    .prefix('videos')

  /*
|--------------------------------------------------------------------------
| Job Routes
|--------------------------------------------------------------------------
*/
  Route.group(() => {
    Route.post('/reindex', 'JobController.reindex').as('reindex')
    Route.post('/summary', 'JobController.summary').as('summary')
  })
    .as('jobs')
    .prefix('jobs')

  /*
|--------------------------------------------------------------------------
| Data Sources Routes
|--------------------------------------------------------------------------
*/
  Route.group(() => {
    Route.post('/upset', 'DataSourcesController.upset').as('upset')
  })
    .as('data-sources')
    .prefix('data-sources')

  // Spacer
})
  .prefix('api')
  .as('api')
  .namespace('App/Controllers/Http/Api')
  .middleware('appAuth')
