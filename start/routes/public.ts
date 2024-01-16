/**
 * All public routes are defined inside this file.
 */

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /**
   * Home page
   */
  Route.get('/', 'HomeController.index').as('home')
  Route.get('/search', 'SearchController.search').as('search').middleware('paginate')

  /**
   * Video detail page
   */
  Route.get('/v/:uid', 'VideoController.show').as('video.show')

  /**
   * Lists
   */
  Route.get('/popular', 'ListController.popular').as('list.popular').middleware('paginate')
  Route.get('/recent', 'ListController.recent').as('list.recent').middleware('paginate')
  Route.get('/new-release', 'ListController.newReleases')
    .as('list.newRelease')
    .middleware('paginate')

  Route.get('/a/:slug', 'ListController.castsBySlug').as('list.castBySlug').middleware('paginate')
  Route.get('/director/:uid', 'ListController.director').as('list.director').middleware('paginate')
  Route.get('/maker/:uid', 'ListController.maker').as('list.maker').middleware('paginate')
  Route.get('/tag/:slug', 'ListController.tag').as('list.tag').middleware('paginate')

  Route.get('/generes', 'ListController.generes').as('list.generes').middleware('paginate')
  Route.get('/actresses', 'ListController.actresses').as('list.actresses').middleware('paginate')

  /**
   * Contact
   */
  Route.get('/contact', 'WebController.contact').as('contact')
  Route.post('/contact', 'SupportController.sendContact')
    .as('sendContact')
    .middleware(['throttle:sendContact', 'turnstile'])

  /**
   * Pages
   */
  Route.get(':slug', 'WebController.page').as('web.page')
})
  .as('web')
  .namespace('App/Controllers/Http/Web')
