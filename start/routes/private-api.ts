import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /*
|--------------------------------------------------------------------------
| Video Routes
|--------------------------------------------------------------------------
*/
  Route.group(() => {
    Route.post('/by-code', 'VideoApiController.getVideoByCode').as('videos.byCode')
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
    Route.post('/upset', 'DataSourceApiController.upset').as('upset')
  })
    .as('data-sources')
    .prefix('data-sources')

  // Spacer
})
  .prefix('api')
  .as('api')
  .namespace('App/Controllers/Http/Api')
  .middleware('appAuth')
