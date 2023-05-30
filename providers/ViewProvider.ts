import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import File from 'App/Models/File'
import DeviceDetector = require('device-detector-js')

export default class ViewProvider {
  private deviceDetector = new DeviceDetector()

  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // All bindings are ready, feel free to use them
    const View = await this.app.container.use('Adonis/Core/View')
    View.global('dateFromNow', (value: DateTime) => {
      return value.setZone('Asia/Ho_Chi_Minh').toRelative()
    })
    View.global('humanReadableDate', (value: DateTime) => {
      return value.setZone('Asia/Ho_Chi_Minh').toLocaleString(DateTime.DATETIME_SHORT)
    })
    View.global('formatDate', (value: Date) => {
      const date = DateTime.fromJSDate(value)
      return date.toISODate()
    })
    View.global('dateFormat', (value: DateTime) => {
      return value.toLocaleString()
    })
    View.global('imageUrl', (file: File, getThumbnail: boolean) => {
      if (!file) return '/img/no-image.png'
      if (getThumbnail && file.thumbnailPath) return `${Env.get('CDN_URL')}/${file.thumbnailPath}`
      return `${Env.get('CDN_URL')}/${file.path}`
    })
    View.global('deviceInfo', (userAgent: string) => {
      if (!userAgent) return 'None'
      const { client, os, device, bot } = this.deviceDetector.parse(userAgent)
      if (bot) return `${bot?.name}/${bot?.category}`
      if (!os) return userAgent

      const arr: string[] = []

      if (client) {
        arr.push(`${client.name}`)
      }

      arr.push(`(${os?.name}/${os?.version})`)

      if (device) {
        const deviceInfo: string[] = []
        if (device?.type) {
          deviceInfo.push(`${device?.type}`)
        }
        if (device?.brand) {
          deviceInfo.push(`${device?.brand}`)
        }
        if (deviceInfo.length) {
          arr.push(`${deviceInfo.join('/')}`)
        }
      }
      return arr.join(' ')
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
