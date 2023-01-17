import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'HomeController.index').as('home')
Route.get('/sitemap.xml', 'WebController.sitemap').as('sitemap')
Route.get('/uploads/images/*', 'WebController.image').as('image')
Route.get('/v/:uid', 'VideoController.show').as('videos.show')

Route.group(() => {
  Route.get('/popular', 'ListController.popular').as('popular')
  Route.get('/new-release', 'ListController.newRelease').as('newRelease')
  Route.get('/cast/:uid', 'ListController.cast').as('cast')
  Route.get('/director/:uid', 'ListController.director').as('director')
  Route.get('/maker/:uid', 'ListController.maker').as('maker')
  Route.get('/tag/:slug', 'ListController.tags').as('tag')
}).as('list')
