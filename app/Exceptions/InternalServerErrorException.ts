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
| new InternalServerErrorException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/

const message = 'Internal Server Error. Please check your request and try again.'
const status = 500
const E_RUNTIME_EXCEPTION = 'E_RUNTIME_EXCEPTION'

export default class InternalServerErrorException extends Exception {
  constructor(error?: string) {
    super(error || message, status, E_RUNTIME_EXCEPTION)
  }
}
