import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Queue } from '@ioc:Rlanz/Queue'

export default class JobController {
  public async summary({ response }: HttpContextContract) {
    const job = await Queue.dispatch('App/Jobs/SummaryJob', {})
    return response.json({
      job,
    })
  }

  public async reindex({ response }: HttpContextContract) {
    const job = await Queue.dispatch('App/Jobs/ReindexJob', {})
    return response.json({
      job,
    })
  }
}
