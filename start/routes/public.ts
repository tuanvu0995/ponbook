import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'HomeController.index').as('home')
Route.get('/sitemap.xml', 'WebController.sitemap').as('sitemap')
Route.get('/uploads/images/*', 'WebController.image').as('image')
Route.get('/v/:uid', 'VideoController.show').as('videos.show')
Route.post('/search', 'WebController.postSearch').as('web.postSearch')
Route.get('/search/:searchId', 'WebController.search').as('web.search')
Route.get('/contact', 'WebController.contact').as('web.contact')
Route.get('/about', 'WebController.about').as('web.about')
Route.get('/privacy', 'WebController.privacy').as('web.privacy')
Route.get('/terms', 'WebController.terms').as('web.terms')
Route.get('/faq', 'WebController.faq').as('web.faq')

Route.group(() => {
  Route.get('/popular', 'ListController.popular').as('popular')
  Route.get('/new-release', 'ListController.newRelease').as('newRelease')
  Route.get('/recent', 'ListController.recent').as('recent')
  Route.get('/new-comments', 'ListController.newComments').as('newComments')
  Route.get('/cast/:uid', 'ListController.cast').as('cast')
  Route.get('/director/:uid', 'ListController.director').as('director')
  Route.get('/maker/:uid', 'ListController.maker').as('maker')
  Route.get('/tag/:slug', 'ListController.tags').as('tag')
}).as('list')
