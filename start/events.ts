/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'
import Mail from '@ioc:Adonis/Addons/Mail'
import Visitor from 'App/Models/Visitor'

Event.on('db:query', (query) => {
  if (Application.inProduction) {
    Logger.debug(JSON.stringify(query, null, 2))
  } else {
    Database.prettyPrint(query)
  }
})

Event.on('user:created', async (user) => {
  await Mail.use('mailgun').send(
    (message) => {
      console.log(user.email)
      message
        .from('no-reply@ponbook.net')
        .to(user.email)
        .subject('Welcome Onboard!')
        .text('<h1>Welcome Onboard!</h1>')
    },
    {
      oTags: ['signup'],
    }
  )
})

Event.on('visitor:visit', async (request: any) => {
  const excludes = ['/api', '/crawler', '/admin', '/account', '/login', '/logout', '/register']
  const isExcluded = excludes.some((exclude) => request.url().startsWith(exclude))
  // check if path has file extension
  if (request.url().includes('.') || isExcluded) {
    return
  }

  const ipAddress = request.ip()
  const path = request.url()

  const now = DateTime.now()
  const exists = await Visitor.query()
    .where('ip_address', ipAddress)
    .where('path', path)
    // from 00:00:00 to 23:59:59
    .whereBetween('created_at', [now.startOf('day').toString(), now.endOf('day').toString()])
    .first()
  if (exists) {
    exists.count += 1
    await exists.save()
    return
  }
  const data = {
    ip_address: request.ip(),
    user_agent: request.header('user-agent'),
    method: request.method(),
    headers: JSON.stringify(request.headers()),
    path: request.url(),
    count: 1,
    country: request.header('cf-ipcountry')?.toLocaleLowerCase() || 'unknown',
  }
  await Visitor.create(data)
})
