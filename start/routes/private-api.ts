import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {
  Route.get('/health', async ({ response }) => {
    const report = await HealthCheck.getReport()
    return report.healthy ? response.ok(report) : response.badRequest(report)
  }).as('health')

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
})
  .prefix('api')
  .as('api')
  .namespace('App/Controllers/Http/Api')
  .middleware('appAuth')
