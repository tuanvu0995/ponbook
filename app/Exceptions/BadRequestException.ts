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
| new BadRequestException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
const message = 'Bad request. Please check your request and try again.'
const status = 400
const E_RUNTIME_EXCEPTION = 'E_RUNTIME_EXCEPTION'

export default class BadRequestException extends Exception {
  constructor() {
    super(message, status, E_RUNTIME_EXCEPTION)
  }
}
