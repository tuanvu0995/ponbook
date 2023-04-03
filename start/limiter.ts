/*
|--------------------------------------------------------------------------
| Define HTTP rate limiters
|--------------------------------------------------------------------------
|
| The "Limiter.define" method callback receives an instance of the HTTP
| context you can use to customize the allowed requests and duration
| based upon the user of the request.
|
*/

import { Limiter } from '@adonisjs/limiter/build/services'

export const { httpLimiters } = Limiter.define('global', () => {
  return Limiter.allowRequests(100).every('5 min').allowRequests(300).every('1 day')
}).define('guestComment', () => {
  return Limiter.allowRequests(3).every('1 min')
})
