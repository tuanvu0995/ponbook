declare module '@ioc:InfluxDB' {
  import InfluxDBClient from 'providers/InfluxDB/InfluxClient'
  const InfluxDB: InfluxDBClient
  export default InfluxDB
}
