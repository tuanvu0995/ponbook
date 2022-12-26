import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'

export default class FileController {
  public async download({ request, response }: HttpContextContract): Promise<any> {
    const { kind, name } = request.params()
    const fileLocation = [kind, name].join('/')

    if (!(await Drive.exists(fileLocation))) {
      return response.notFound()
    }

    const { size } = await Drive.getStats(fileLocation)

    // response.type('')
    response.header('content-length', size)

    return response.stream(await Drive.getStream(fileLocation))
  }
}
