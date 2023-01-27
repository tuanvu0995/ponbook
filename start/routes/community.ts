import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CommunityController.feed').as('feed')
  Route.get('/p/:uid', 'CommunityController.postDetail').as('post:detail')

  Route.post('/p/:uid/comments', 'CommunityController.postComment')
    .as('post:comment')
    .middleware('auth')
})
  .as('community')
  .prefix('community')
