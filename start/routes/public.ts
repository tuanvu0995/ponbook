/**
 * All public routes are defined inside this file.
 */

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'HomeController.index').as('home')
  Route.get('/contact', 'WebController.contact').as('contact')
  Route.post('/contact', 'SupportController.sendContact')
    .as('sendContact')
    .middleware('throttle:sendContact')
  Route.get(':slug', 'WebController.page').as('web.page')
})
  .as('web')
  .namespace('App/Controllers/Http/Web')
