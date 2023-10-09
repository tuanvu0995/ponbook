import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import { DateTime } from 'luxon'

export default class JobsController {
  public async summaryViews({ response }: HttpContextContract) {
    Event.emit('job:summaryViews', { startTime: DateTime.now() })

    return response.json({
      success: true,
      message: 'Job summaryViews is running',
    })
  }
}
