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

Route.get('/', 'HomeController.index').as('home')

Route.group(() => {
  Route.get('/login', 'Auth/LoginController.index').as('login')
  Route.post('/login', 'Auth/LoginController.login').as('post:login')
  Route.get('/register', 'Auth/RegisterController.index').as('register')
  Route.post('/register', 'Auth/RegisterController.register').as('post:register')
  Route.post('/logout', 'Auth/LoginController.logout').as('logout')
}).as('auth')

Route.resource('videos', 'VideoController').as('videos').except(['edit', 'update', 'show'])
Route.get('/videos/:uid/edit', 'VideoController.edit').as('videos.edit').middleware('auth')
Route.get('/videos/:uid', 'VideoController.show').as('videos.show')
Route.put('/videos/:uid', 'VideoController.update').as('videos.update').middleware('auth')

Route.get('files/:kind/:name', 'FileController.download').as('files:download')

Route.group(() => {
  Route.get('/popular', 'ListController.popular').as('popular')
  Route.get('/new-release', 'ListController.newRelease').as('newRelease')
  Route.get('/cast/:uid', 'ListController.cast').as('cast')
  Route.get('/director/:uid', 'ListController.director').as('director')
  Route.get('/maker/:uid', 'ListController.maker').as('maker')
  Route.get('/tag/:slug', 'ListController.tags').as('tag')
}).as('list')

Route.group(() => {
  Route.post('/videos/:uid/image', 'VideoController.uploadImage')
    .as('videos.uploadImage')
    .middleware('auth')
  Route.post('/videos/:uid/tag', 'VideoController.addTag').as('videos.addTag').middleware('auth')
})
  .as('api')
  .prefix('api')

Route.post('crawler', 'CrawlerController.crawl').as('crawler')
