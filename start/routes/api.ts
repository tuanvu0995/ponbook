import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import axios from 'axios'

Route.get('/api/models', async ({ request, response }: HttpContextContract) => {
  const url = 'http://go.xlirdr.com' + request.url(true)
  const rsp = await axios({
    url,
    method: 'GET',
    responseType: 'json',
    headers: { 'User-Agent': 'Axios 1.2.1' },
  })
  return response.json(rsp.data)
})
