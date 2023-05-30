import { Point } from '@influxdata/influxdb-client'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import InfluxDB from '@ioc:InfluxDB'

export default class RequestListener {
  public async onReceived(ctx: EventsList['request:received']) {
    const requestId = ctx.request.id() || 'unknown'
    const host = ctx.request.hostname() || 'unknown'
    const path = ctx.request.url() || 'unknown'
    const ip = ctx.request.ip() || 'unknown'
    const point = new Point('ponbook')
      .tag('requestId', requestId)
      .tag('host', host)
      .tag('path', path)
      .tag('state', 'start')
      .stringField('value', ip)

    InfluxDB.log(point)
  }

  public async onResponded(ctx: EventsList['request:responded']) {
    const requestId = ctx.request.id() || 'unknown'
    const host = ctx.request.hostname() || 'unknown'
    const path = ctx.request.url() || 'unknown'
    const ip = ctx.request.ip() || 'unknown'
    const point = new Point('ponbook')
      .tag('requestId', requestId)
      .tag('host', host)
      .tag('path', path)
      .tag('state', 'end')
      .stringField('value', ip)

    InfluxDB.log(point)
  }
}
