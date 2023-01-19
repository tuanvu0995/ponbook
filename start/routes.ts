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
import './routes/public'
import './routes/admin'
import './routes/user'

Route.group(() => {
  Route.get('/login', 'Auth/LoginController.index').as('login')
  Route.post('/login', 'Auth/LoginController.login').as('post:login')
  Route.get('/register', 'Auth/RegisterController.index').as('register')
  Route.post('/register', 'Auth/RegisterController.register').as('post:register')
  Route.post('/logout', 'Auth/LoginController.logout').as('logout')
}).as('auth')

Route.post('crawler', 'UploadsController.videoFromBot').as('crawler')
Route.post('crawler/image', 'UploadsController.imageFromBot').as('crawler:image')
Route.post('crawler/code-exists', 'UploadsController.codeExists').as('crawler:codeExists')
