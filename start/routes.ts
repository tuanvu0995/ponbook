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

Route.get('/', async ({ view }) => {
  return view.render('index')
}).as('home')

Route.group(() => {
  Route.get('/login', 'Auth/LoginController.index').as('login')
  Route.post('/login', 'Auth/LoginController.login').as('post:login')
  Route.get('/register', 'Auth/RegisterController.index').as('register')
  Route.post('/register', 'Auth/RegisterController.register').as('post:register')
  Route.post('/logout', 'Auth/LoginController.logout').as('logout')
}).as('auth')

Route.resource('videos', 'VideoController').as('videos').except(['edit'])
Route.get('/videos/:uid/edit', 'VideoController.edit').as('videos.edit')
