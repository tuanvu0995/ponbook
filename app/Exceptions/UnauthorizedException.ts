import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnauthorizedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/

const message = 'You are not authorized to access this resource.'
const status = 401
const E_RUNTIME_EXCEPTION = 'E_RUNTIME_EXCEPTION'

export default class UnauthorizedException extends Exception {
  constructor() {
    super(message, status, E_RUNTIME_EXCEPTION)
  }
}
