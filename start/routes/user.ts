import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/profile', 'ProfileController.profile').as('profile')
  Route.put('/profile', 'ProfileController.update').as('updateProfile')
  Route.get('/password', 'ProfileController.password').as('password')
  Route.post('/password', 'ProfileController.changePassword').as('changePassword')
})
  .as('account')
  .prefix('account')
  .middleware('auth')
  .namespace('App/Controllers/Http/Account')

Route.group(() => {
  Route.post('/videos/:uid/comments', 'CommentController.store').as('videos.comments.store')
}).middleware('auth')

Route.group(() => {
  Route.post('/videos/:uid/favorite', 'VideoController.favorite').as('videos.favorite')
  Route.post('uploads/image', 'UploadsController.uploadImage').as('uploads.image')
})
  .as('api')
  .prefix('api')
  .middleware('auth')
