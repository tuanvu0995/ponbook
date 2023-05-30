import Env from '@ioc:Adonis/Core/Env'

export const influxDBConfig = {
  url: Env.get('INFLUX_URL'),
  token: Env.get('INFLUX_TOKEN'),
  org: Env.get('INFLUX_ORG'),
  bucket: Env.get('INFLUX_BUCKET'),
}
