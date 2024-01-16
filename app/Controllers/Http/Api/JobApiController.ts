import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Queue } from '@ioc:Rlanz/Queue'

export default class JobApiController {
  public async summary({ response }: HttpContextContract) {
    const job = await Queue.dispatch('App/Jobs/SummaryJob', {})
    return response.json({
      job,
    })
  }

  public async reindex({ response, request }: HttpContextContract) {
    const { incremental } = request.only(['incremental'])
    const job = await Queue.dispatch('App/Jobs/ReindexJob', {
      incremental: incremental === 'false' ? false : true,
    })
    return response.json({
      job,
    })
  }
}
