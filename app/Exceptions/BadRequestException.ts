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
const E_BAD_REQUEST = 'E_BAD_REQUEST'

export default class BadRequestException extends Exception {
  constructor(error?: string) {
    super(error || message, status, E_BAD_REQUEST)
  }
}
