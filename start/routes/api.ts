import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/searches', 'SearchesController.searches').as('searches')
  Route.get('/searches/:searchId', 'SearchesController.getSearch').as('search:get')
  Route.get('/models', 'ModelsController.getModel').as('models:get')

  Route.group(() => {
    Route.post('/videos/:uid/favorite', 'VideoController.favorite').as('videos.favorite')
  })
    .as('guest-api')
    .prefix('guest')
})
  .as('api.public')
  .prefix('api')

Route.group(() => {
  Route.post('/videos/:uid/favorite', 'VideoController.favorite').as('videos.favorite')
  Route.post('/videos/favorite-status', 'VideoController.getFavoriteStatusByVideos').as(
    'videos.getFavoriteStatusByVideos'
  )
  Route.post('uploads/image', 'UploadsController.uploadImage').as('uploads.image')
})
  .as('api')
  .prefix('api')
  .middleware('auth')
