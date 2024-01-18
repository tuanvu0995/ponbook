import Env from '@ioc:Adonis/Core/Env'
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client'

export default class Influx {
  private instance: InfluxDB
  private writeApi: WriteApi

  public bucket: string
  public org: string
  public location: string

  constructor() {
    this.bucket = Env.get('INFLUX_BUCKET')
    this.org = Env.get('INFLUX_ORG')
    this.location = Env.get('APP_DOMAIN')

    this.instance = new InfluxDB({
      url: Env.get('INFLUX_HOST'),
      token: Env.get('INFLUX_API_KEY'),
    })
    this.writeApi = this.instance.getWriteApi(this.org, this.bucket, 'ns')
    this.writeApi.useDefaultTags({ location: this.location })
  }

  public getQueryApi() {
    return this.instance.getQueryApi(this.org)
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
