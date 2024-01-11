import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import File from 'App/Models/File'
import { DateTime } from 'luxon'

export default class ViewProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // All bindings are ready, feel free to use them
    const View = await this.app.container.use('Adonis/Core/View')
    const Env = await this.app.container.use('Adonis/Core/Env')

    View.global('dateFromNow', (value: DateTime) => {
      return value.setZone('Asia/Ho_Chi_Minh').toRelative()
    })

    View.global('humanReadableDate', (value: DateTime) => {
      return value.setZone('Asia/Ho_Chi_Minh').toLocaleString(DateTime.DATETIME_SHORT)
    })

    View.global('dateFormat', (date: DateTime, format: string = 'YYYY-MM-DD hh:mm') =>
      date.toFormat(format)
    )

    View.global('imageUrl', (file: File, getThumbnail: boolean) => {
      if (!file) return '/img/no-image.png'
      if (getThumbnail && file.dataUrl) return file.dataUrl
      return `${Env.get('CDN_URL')}/${file.path}`
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
