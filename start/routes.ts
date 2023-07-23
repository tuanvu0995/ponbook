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

Route.get('/', async () => ({ hello: 'world' })).as('home')

/*
|--------------------------------------------------------------------------
| Auth  Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('/sign-in', 'AuthController.signIn').as('signIn')
  Route.post('/sign-up', 'AuthController.signUp').as('signUp')
  Route.post('/logout', 'AuthController.logout').as('logout').middleware('auth:api')
})
  .prefix('v1/auth')
  .as('v1.auth')

/*
|--------------------------------------------------------------------------
| Video Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'VideoController.index').as('videos.index').middleware('paginate')

  Route.get('/:uid', 'VideoController.show').as('videos.show')

  Route.get('/:uid/related', 'VideoController.getRelatedVideos').as('videos.related')

  Route.get('/:uid/comments', 'CommentController.getCommentsByVideoUid')
    .as('videos.comments')
    .middleware('paginate')
})
  .as('v1.videos')
  .prefix('v1/videos')

/*
|--------------------------------------------------------------------------
| Lists Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('recent', 'ListsController.recentVideos').as('recents').middleware('paginate')
  Route.get('popular', 'ListsController.popularVideos').as('populars').middleware('paginate')
  Route.get('new-comment', 'ListsController.newCommentAddedVideos')
    .as('new-comment-added')
    .middleware('paginate')
})
  .as('v1.lists')
  .prefix('v1/lists')

/*
|--------------------------------------------------------------------------
| Tags Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'TagsController.index').as('list').middleware('paginate')
  Route.get('/:slug', 'TagsController.show').as('show')
  Route.get('/:slug/videos', 'TagsController.getVideosByTag').as('videos').middleware('paginate')
})
  .as('v1.tags')
  .prefix('v1/tags')
