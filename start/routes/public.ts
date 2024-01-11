/**
 * All public routes are defined inside this file.
 */

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'HomeController.index').as('home')

  /**
   * Video detail page
   */
  Route.get('/v/:uid', 'VideoController.show').as('video.show')

  /**
   * Lists
   */
  Route.get('/popular', 'ListController.popular').as('list.popular')
  Route.get('/recent', 'ListController.recent').as('list.recent')
  Route.get('/new-release', 'ListController.newReleases').as('list.newRelease')

  Route.get('/a/:slug', 'ListController.castsBySlug').as('list.castBySlug')
  Route.get('/director/:uid', 'ListController.director').as('list.director')
  Route.get('/maker/:uid', 'ListController.maker').as('list.maker')
  Route.get('/tag/:slug', 'ListController.tag').as('list.tag')

  /**
   * Contact
   */
  Route.get('/contact', 'WebController.contact').as('contact')
  Route.post('/contact', 'SupportController.sendContact')
    .as('sendContact')
    .middleware('throttle:sendContact')

  Route.get(':slug', 'WebController.page').as('web.page')
})
  .as('web')
  .namespace('App/Controllers/Http/Web')
