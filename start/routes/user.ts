import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/profile', 'ProfileController.profile').as('account')
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

  Route.get('/boxes/create', 'BoxesController.create').as('boxes.create')
  Route.get('/boxes/:uid/edit', 'BoxesController.edit').as('boxes.edit')
  Route.put('/boxes/:uid', 'BoxesController.update').as('boxes.update')
}).middleware('auth')

Route.group(() => {
  Route.get('/:uid', 'ProfileController.index').as('index')
})
  .as('profile')
  .prefix('u')
  .namespace('App/Controllers/Http/Profile')
