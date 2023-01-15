import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/videos', 'VideoController.index').as('videos.index')
  Route.get('/videos/create', 'VideoController.create').as('videos.create')
  Route.post('/videos/:uid/comments', 'CommentController.store').as('videos.comments.store')
  Route.put('/videos/:uid', 'VideoController.update').as('videos.update')
  Route.get('/videos/:uid/delete', 'VideoController.delete').as('videos.delete')
  Route.get('/videos/:uid/edit', 'VideoController.edit').as('videos.edit')
  Route.delete('videos/:uid', 'VideoController.destroy').as('videos.destroy')
}).middleware('auth')

Route.group(() => {
  Route.post('/videos/:uid/image', 'VideoController.uploadImage').as('videos.uploadImage')
  Route.post('/videos/:uid/tag', 'VideoController.addTag').as('videos.addTag')
  Route.delete('/videos/:uid/image', 'VideoController.deleteImage').as('videos.deleteImage')
})
  .as('api')
  .prefix('api')
  .middleware('auth')
