import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'

export default class TasksController {
  public async summaryViews({ response }: HttpContextContract) {
    Event.emit('task:summaryViews', undefined)

    return response.json({
      success: true,
      message: 'Task summaryViews is running',
    })
  }
}
