import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'

export default class TasksController {
  public async run({ response }: HttpContextContract) {
    Event.emit('task:run', undefined)

    return response.json({
      success: true,
      message: 'Tasks is running',
    })
  }
}
