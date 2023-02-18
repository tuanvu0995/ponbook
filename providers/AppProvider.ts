import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'
import DeviceDetector from 'device-detector-js'

export default class AppProvider {
  private deviceDetector = new DeviceDetector()
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const View = await this.app.container.use('Adonis/Core/View')
    View.global('dateFromNow', (value: DateTime) => {
      return value.setZone('Asia/Ho_Chi_Minh').toRelative()
    })
    View.global('humanReadableDate', (value: DateTime) => {
      return value.setZone('Asia/Ho_Chi_Minh').toLocaleString(DateTime.DATETIME_SHORT)
    })
    View.global('imageUrl', (imageName: string) => {
      if (!imageName) return '/img/no-image.png'
      if (imageName.startsWith('/uploads/')) {
        imageName = imageName.replace('/uploads/', '')
      }
      return `/uploads/${imageName}`
    })
    View.global('deviceInfo', (userAgent: string) => {
      const { client, os, device, bot } = this.deviceDetector.parse(userAgent)
      if (bot) {
        return `${bot?.name}/${bot?.category}`
      }
      return `${client?.name}/${os?.name} ${os?.version} (${device?.type}/${device?.brand}}`
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
