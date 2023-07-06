import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/sign-in', 'AuthController.signIn').as('signIn')
    Route.post('/sign-up', 'AuthController.signUp').as('signUp')
    Route.post('/logout', 'AuthController.logout').as('logout').middleware('auth:api')
  })
    .as('auth')
    .prefix('auth')

  Route.get('/videos', 'VideoController.index').as('videos.index').middleware('paginationQuery')
  Route.get('/videos/:uid', 'VideoController.show').as('videos.show')
  Route.get('/videos/:uid/related', 'VideoController.getRelatedVideos').as('videos.related')
  Route.get('/videos/:uid/comments', 'CommentController.getCommentByVideoUid')
    .as('videos.comments')
    .middleware('paginationQuery')
})
  .prefix('api/v1')
  .as('api/v1')
  .namespace('App/Controllers/Http/Api')
