import { Exception } from '@adonisjs/core/build/standalone'

const status = 429
const errorCode = 'E_TOO_MANY_REQUEST_EXCEPTION'

export default class TooManyRequestException extends Exception {
  constructor(message = 'Too many requests. Please try after some time.') {
    super(message, status, errorCode)
  }
}
