import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'

export type SendEmailPayload = {}

export default class implements JobHandlerContract {
	constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle(payload: SendEmailPayload) {}

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
