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
      if (bot) return `${bot?.name}/${bot?.category}`
      if (!os) return userAgent

      const arr: string[] = []
      if (client) {
        const clientInfo: string[] = [client.name]
        if (client?.version) {
          clientInfo.push(`/${client?.version}`)
        }
        arr.push(`${clientInfo.join('')}`)
      }
      if (device) {
        const deviceInfo: string[] = []
        if (device?.type) {
          deviceInfo.push(`${device?.type}`)
        }
        if (device?.brand) {
          deviceInfo.push(`/${device?.brand}`)
        }
        if (deviceInfo.length) {
          arr.push(`|${deviceInfo.join('')}`)
        }
      }
      arr.push(`(${os?.name}/${os?.version})`)
      return arr.join('')
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
