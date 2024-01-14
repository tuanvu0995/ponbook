import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import { Queue } from '@ioc:Rlanz/Queue'
import { DateTime } from 'luxon'

export default class JobController {
  public async run({ response }: HttpContextContract) {
    Event.emit('task:run', undefined)
    return response.json({
      success: true,
      message: 'Tasks is running',
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
