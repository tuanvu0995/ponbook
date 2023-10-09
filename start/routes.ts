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
  Route.get('/me', 'AuthController.me').as('me').middleware('auth:api')
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

  Route.post('/by-code', 'VideoController.getVideoByCode').as('videos.byCode')

  Route.post('/:uid/favorite', 'VideoController.favorite')
    .as('videos.favorite')
    .middleware('auth:api')
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
  Route.get('new-release', 'ListsController.newRelease').as('new-release').middleware('paginate')
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
  Route.get('random', 'TagsController.getRandomTags').as('random')
  Route.get('/', 'TagsController.index').as('list').middleware('paginate')
  Route.get('/:slug', 'TagsController.show').as('show')
  Route.get('/:slug/videos', 'TagsController.getVideosByTag').as('videos').middleware('paginate')
})
  .as('v1.tags')
  .prefix('v1/tags')

/*
|--------------------------------------------------------------------------
| Casts Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'CastsController.index').as('list').middleware('paginate')
  Route.get('/:slug', 'CastsController.show').as('show')
  Route.get('/:slug/videos', 'CastsController.getVideosByCast').as('videos').middleware('paginate')
})
  .as('v1.casts')
  .prefix('v1/casts')

/*
|--------------------------------------------------------------------------
| Director Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'DirectorsController.index').as('list').middleware('paginate')
  Route.get('/:uid', 'DirectorsController.show').as('show')
  Route.get('/:uid/videos', 'DirectorsController.getVideosByDirector')
    .as('videos')
    .middleware('paginate')
})
  .as('v1.directors')
  .prefix('v1/directors')

/*
|--------------------------------------------------------------------------
| Maker Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'MakersController.index').as('list').middleware('paginate')
  Route.get('/:uid', 'MakersController.show').as('show')
  Route.get('/:uid/videos', 'MakersController.getVideosByMaker').as('videos').middleware('paginate')
})
  .as('v1.makers')
  .prefix('v1/makers')

/*
|--------------------------------------------------------------------------
| Comments Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('/', 'CommentController.store').as('store').middleware('auth:api')
  Route.put('/:uid', 'CommentController.update').as('update').middleware('auth:api')
  Route.delete('/:uid', 'CommentController.destroy').as('destroy').middleware('auth:api')
  Route.get('/:uid/replies', 'CommentController.getCommentsByParentUid')
    .as('getCommentsByParentUid')
    .middleware('paginate')
})
  .as('v1.comments')
  .prefix('v1/comments')

/*
|--------------------------------------------------------------------------
| Pages Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/:slug', 'PagesController.getPageFromSlug').as('getPageFromSlug')
})
  .as('v1.pages')
  .prefix('v1/pages')

/*
|--------------------------------------------------------------------------
| Search Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('', 'SearchesController.search').as('search')
  Route.post('/search/at', 'SearchesController.atSearch').as('atSearch')
  Route.post('/indexing', 'SearchesController.indexing').as('indexing')
})
  .as('v1.searches')
  .prefix('v1/searches')

/*
|--------------------------------------------------------------------------
| Contacts Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('/', 'ContactsController.store').as('store').middleware('throttle:sendContact')
})
  .as('v1.contacts')
  .prefix('v1/contacts')

/*
|--------------------------------------------------------------------------
| Categories Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('/recalculate', 'CategoryController.recalculate').as('recalculate')
  Route.get('/', 'CategoryController.index').as('index').middleware('paginate')
  Route.post('/', 'CategoryController.store').as('store')
  Route.get('/:slug/videos', 'CategoryController.getVideosBySlug')
    .as('getVideosBySlug')
    .middleware('paginate')
  Route.get('/:slug', 'CategoryController.getBySlug').as('getBySlug')
})
  .as('v1.categories')
  .prefix('v1/categories')

/*
|--------------------------------------------------------------------------
| Data Sources Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('/upset', 'DataSourcesController.upset').as('upset')
})
  .as('v1.data-sources')
  .prefix('v1/data-sources')
