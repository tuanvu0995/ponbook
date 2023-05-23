import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'

export default class Email {
  public async onEmailSent(event: any) {
    if (Application.inProduction) {
      Logger.debug(JSON.stringify(event, null, 2))
    } else {
      Mail.prettyPrint(event)
    }
  }
}
