import _ from 'lodash'
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { influxDBConfig } from 'Config/influxdb'

export default class InfluxClient {
  private readonly influxDB: InfluxDB
  private config: typeof influxDBConfig

  constructor(config: typeof influxDBConfig) {
    this.config = config
    this.influxDB = new InfluxDB({ url: this.config.url, token: this.config.token })
  }

  public log(points: Point | Point[]) {
    const writeApi = this.getWriteApi(this.config.org, this.config.bucket).useDefaultTags({
      region: 'sg',
    })
    if (_.isArray(points)) {
      writeApi.writePoints(points)
    } else {
      writeApi.writePoint(points)
    }

    writeApi.close().then(() => console.log('WRITE FINISHED'))
  }

  private getWriteApi(org: string, bucket: string) {
    return this.influxDB.getWriteApi(org, bucket)
  }
}
