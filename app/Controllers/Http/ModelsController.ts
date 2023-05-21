import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

export default class ModelsController {
  public async getModel({ request, response }: HttpContextContract) {
    const url = 'http://go.xlirdr.com' + request.url(true)
    const rsp = await axios({
      url,
      method: 'GET',
      responseType: 'json',
      headers: { 'User-Agent': 'Axios 1.2.1' },
    })
    return response.json(rsp.data)
  }
}
