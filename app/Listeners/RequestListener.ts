import type { EventsList } from '@ioc:Adonis/Core/Event'

export default class RequestListener {
  public async onReceived(_: EventsList['request:received']) {}

  public async onResponded(_: EventsList['request:responded']) {}
}
