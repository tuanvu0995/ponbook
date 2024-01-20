import type { JobHandlerContract, Job } from '@ioc:Queue'
import influx from '@ioc:Influx'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'
import SearchTerm from 'App/Models/SearchTerm'

export default class implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle() {
    Logger.info('Search terms job started')

    const queryApi = influx.getQueryApi()
    // unit timestamp like: 1621726200 (00 ending)
    const last7Days = DateTime.now().minus({ days: 7 }).toISO()
    const yesterday = DateTime.now().minus({ days: 1 })

    let lastOffset = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const searchTermsQuery = `
      from(bucket: "${influx.bucket}")
      |> range(start: ${last7Days}, stop: ${yesterday})
      |> limit(n:100, offset: ${lastOffset})
      |> filter(fn: (r) => r["_measurement"] == "search:terms")
      |> filter(fn: (r) => r["location"] == "${influx.location}")
      |> group(columns: ["term"])
      |> aggregateWindow(every: 5s, fn: mean, createEmpty: false)
      |> yield(name: "mean")
    `

      const searchTerms = await queryApi.collectRows(searchTermsQuery)

      if (searchTerms.length === 0) {
        break
      }

      const searchTermsArray = searchTerms.map((term: any) => term.term)

      Logger.info(`Upserting ${searchTermsArray.length} search terms`)
      await this.upsertSearchTerms(searchTermsArray)

      lastOffset += searchTermsArray.length

      await this.job.updateData({ processed: lastOffset })

      await this.job.updateProgress(1)
    }

    Logger.info('Search terms job completed')
  }

  private async upsertSearchTerms(searchTerms: string[]) {
    for (const term of searchTerms) {
      try {
        const exists = await SearchTerm.query().where('term', term).first()
        if (!exists) {
          await SearchTerm.create({
            term,
            count: 1,
          })
        }
      } catch (error) {
        Logger.error(error)
      }
    }

    Logger.info(`Upserted ${searchTerms.length} search terms`)
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
