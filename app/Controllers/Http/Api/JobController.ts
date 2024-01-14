import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Queue } from '@ioc:Rlanz/Queue'
import { DateTime } from 'luxon'

export default class JobController {
  public async summary({ response }: HttpContextContract) {
    const now = DateTime.now()
    const job = await Queue.dispatch('App/Jobs/SummaryJob', {
      startAt: now,
    })
    return response.json({
      job,
    })
  }

  public async reindex({ response }: HttpContextContract) {
    const now = DateTime.now()
    const job = await Queue.dispatch('App/Jobs/ReindexJob', {
      startAt: now,
    })
    return response.json({
      job,
    })
  }
}
