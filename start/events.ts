/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'
import Mail from '@ioc:Adonis/Addons/Mail'
import Visitor from 'App/Models/Visitor'
import DeviceDetector from 'device-detector-js'

Event.on('comment:created', 'Comment.onCommentCreated')
Event.on('video:created', 'Video.onVideoCreated')
Event.on('video:updated', 'Video.onVideoUpdated')

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
  const { bot } = new DeviceDetector().parse(request.header('user-agent'))
  if (bot) {
    return
  }

  const excludes = [
    '/api',
    '/crawler',
    '/admin',
    '/account',
    '/login',
    '/logout',
    '/register',
    '/pop-link',
  ]
  const isExcluded = excludes.some((exclude) => request.url().startsWith(exclude))
  // check if path has file extension
  if (request.url().includes('.') || isExcluded) {
    return
  }

  const path = request.url(true)

  const data = {
    ip_address: request.ip(),
    user_agent: request.header('user-agent'),
    method: request.method(),
    headers: JSON.stringify(request.headers()),
    path,
    count: 1,
    country: request.header('cf-ipcountry')?.toLocaleLowerCase() || 'unknown',
  }
  await Visitor.create(data)
})
