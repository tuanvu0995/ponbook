import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'HomeController.index').as('home').middleware('throttle:global')
Route.get('/uploads/images/*', 'WebController.image').as('image')
Route.get('/v/:uid', 'VideoController.show').as('videos.show').middleware('throttle:global')
Route.post('/search', 'WebController.postSearch').as('web.postSearch')
Route.get('/search/:searchId', 'WebController.search').as('web.search')

Route.post('/videos/:uid/guest-comments', 'CommentController.createGuestComment')
  .as('videos.createGuestComment')
  .middleware('throttle:guestComment')

Route.group(() => {
  Route.get('/popular', 'ListController.popular').as('popular')
  Route.get('/new-release', 'ListController.newRelease').as('newRelease')
  Route.get('/recent', 'ListController.recent').as('recent')
  Route.get('/new-comments', 'ListController.newComments').as('newComments')
  Route.get('/cast/:uid', 'ListController.cast').as('cast')
  Route.get('/a/:slug', 'ListController.castsBySlug').as('castBySlug')
  Route.get('/director/:uid', 'ListController.director').as('director')
  Route.get('/maker/:uid', 'ListController.maker').as('maker')
  Route.get('/tag/:slug', 'ListController.tags').as('tag')
  Route.get('/stars', 'ListController.stars').as('stars')
  Route.get('/categories', 'ListController.categories').as('categories')
})
  .as('list')
  .middleware('throttle:global')
