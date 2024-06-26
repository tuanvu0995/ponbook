declare module '@ioc:Adonis/Core/HttpContext' {
  import { TurnstileResponse } from '@ioc:Turnstile'

  interface HttpContextContract {
    turnstile: TurnstileResponse
  }
}
