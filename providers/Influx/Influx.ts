import Env from '@ioc:Adonis/Core/Env'
import { InfluxDB, Point, HttpError, WriteApi } from '@influxdata/influxdb-client'

export default class Influx {
  private writeApi: WriteApi

  constructor() {
    this.writeApi = new InfluxDB({
      url: Env.get('INFLUX_HOST'),
      token: Env.get('INFLUX_API_KEY'),
    }).getWriteApi(Env.get('INFLUX_ORG'), Env.get('INFLUX_BUCKET'), 'ns')

    this.writeApi.useDefaultTags({ location: Env.get('APP_DOMAIN') })
  }

  public async writePoint(
    measurement: string,
    tags: Record<string, string>,
    fields: Record<string, string | number>
  ) {
    const point = new Point(measurement)
    Object.entries(tags).forEach(([key, value]) => point.tag(key, value))
    Object.entries(fields).forEach(([key, value]) => point.floatField(key, value as number))

    this.writeApi.writePoint(point)
  }

  public async close() {
    await this.writeApi.close()
  }
}
