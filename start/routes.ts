/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Logger from '@ioc:Adonis/Core/Logger'

Route.group(() => {
  Route.group(() => {
    Route.get('/login', 'Auth/LoginController.index').as('login')
    Route.post('/login', 'Auth/LoginController.login').as('post:login')
    Route.get('/register', 'Auth/RegisterController.index').as('register')
    Route.post('/register', 'Auth/RegisterController.register').as('post:register')
    Route.post('/logout', 'Auth/LoginController.logout').as('logout')
  })
    .as('auth')
    .prefix('auth')

  /**
   * Videos
   */
  Route.get('/videos/recent', 'VideoController.getRecentAddedVideos').as('videos:recent')
  Route.get('/videos/new-comments', 'VideoController.getNewCommentAddedVideos').as(
    'videos:new-comments'
  )
  Route.get('/videos/:uid/related', 'VideoController.getRelatedVideos').as('videos:related')
  Route.get('/videos/:uid', 'VideoController.show').as('videos:show')

  /**
   * Collection
   */
  Route.get('/collections/:slug', 'CollectionController.show').as('collections:show')

  /**
   * Searches
   */
  Route.post('/searches', 'SearchesController.searches').as('searches')
  Route.get('/searches/:searchId', 'SearchesController.getSearch').as('search:get')

  Route.get('/', ({ response }) => response.json({ name: 'Ponbook api', version: '1.0.0' })).as(
    'index'
  )
})
  .as('v1')
  .prefix('v1')
  .namespace('App/Controllers/Api')

Route.get('ping', async ({ response, request }) => {
  Logger.info('Ping')
  console.log(request.headers())
  return response.ok({ message: 'pong' })
})
