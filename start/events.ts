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
