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
| new NotFoundException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/

const message = 'Resource not found.'
const status = 404
const E_RESOURCE_NOT_FOUND = 'E_RESOURCE_NOT_FOUND'
export default class NotFoundException extends Exception {
  constructor(errorMessage?: string) {
    super(errorMessage || message, status, E_RESOURCE_NOT_FOUND)
  }
}
