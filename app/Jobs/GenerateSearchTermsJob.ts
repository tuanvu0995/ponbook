import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'
import influx from '@ioc:Influx'
import env from 'env'
import Redis from '@ioc:Adonis/Addons/Redis'

export default class implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle() {
    const queryApi = influx.getQueryApi()

    const searchTermsQuery = `
      from(bucket: "${influx.bucket}")
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "search:terms")
      |> filter(fn: (r) => r._field == "${influx.location}")
    `

    console.log(searchTermsQuery)

    const searchTerms = await queryApi.collectRows(searchTermsQuery)
    console.log(searchTerms)
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
