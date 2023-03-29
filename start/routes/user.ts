import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('tests', 'TestsController')
  Route.get('/videos', 'VideoController.index').as('videos.index')
  Route.get('/videos/create', 'VideoController.create').as('videos.create')
  Route.post('/videos/:uid/comments', 'CommentController.store').as('videos.comments.store')
  Route.put('/videos/:uid', 'VideoController.update').as('videos.update')
  Route.get('/videos/:uid/delete', 'VideoController.delete').as('videos.delete')
  Route.get('/videos/:uid/edit', 'VideoController.edit').as('videos.edit')
  Route.delete('videos/:uid', 'VideoController.destroy').as('videos.destroy')
}).middleware('auth')

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
  Route.put('/videos/:uid/image', 'VideoController.setVideoImage').as('videos.setVideoImage')
  Route.post('/videos/:uid/image', 'VideoController.uploadImage').as('videos.uploadImage')
  Route.post('/videos/:uid/tag', 'VideoController.addTag').as('videos.addTag')
  Route.delete('/videos/:uid/image', 'VideoController.deleteImage').as('videos.deleteImage')
  Route.post('/videos/:uid/favorite', 'VideoController.favorite').as('videos.favorite')

  Route.post('uploads/image', 'UploadsController.uploadImage').as('uploads.image')
})
  .as('api')
  .prefix('api')
  .middleware('auth')
