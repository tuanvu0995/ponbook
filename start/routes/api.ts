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
  | Casts Routes
  |--------------------------------------------------------------------------
  */
  Route.group(() => {
    Route.post('/:uid/favorite', 'CastApiController.favorite').as('favorite')
  })
    .as('casts')
    .prefix('casts')

  /*
  |--------------------------------------------------------------------------
  | Videos Routes
  |--------------------------------------------------------------------------
  */
  Route.group(() => {
    Route.post('/:uid/favorite', 'VideoApiController.favorite').as('favorite')
  })
    .as('videos')
    .prefix('videos')
})
  .prefix('api')
  .as('api')
  .namespace('App/Controllers/Http/Api')
