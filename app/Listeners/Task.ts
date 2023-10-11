import _ from 'lodash'
import { DateTime } from 'luxon'
import Logger from '@ioc:Adonis/Core/Logger'
import Video from 'App/Models/Video'
import View from 'App/Models/View'
import CollectionRepo from 'App/Repos/CollectionRepo'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class Task {
  public async run() {
    await this.summaryViews()
    await this.collectionCalculate()
  }

  public async summaryViews() {
    Logger.info('Tasks summaryViews is running')
    try {
      const time = DateTime.now()

      const startOfDay = time.startOf('day')
      const endOfDay = time.endOf('day')

      const views = await View.query()
        .where('created_at', '>=', startOfDay.toSQL())
        .where('created_at', '<=', endOfDay.toSQL())
        .where('range', 'day')

      const videoIds = views.map((view) => view.refererId)
      const uniqueVideoIds = [...new Set(videoIds)]

      const chunks = _.chunk(uniqueVideoIds, 100)
      for (const chunk of chunks) {
        const videos = await Video.query().whereIn('id', chunk)

        await Promise.all(
          videos.map(async (video) => {
            const videoViews = views.filter(
              (view) => view.refererType === 'videos' && view.refererId === video.id
            )
            video.viewCount += videoViews.reduce((acc, view) => acc + view.count, 0)
            await video.save()
          })
        )
      }
    } catch (err) {
      Logger.error(err, 'Error in summaryViews')
      await this.sendAlertToAdmin(['Error in summaryViews', err.message])
    }

    Logger.info('Job summaryViews is finished')
    await this.sendAlertToAdmin(['Job summaryViews is finished'])
  }

  public async collectionCalculate() {
    Logger.info('Tasks collectionCalculate is running')
    try {
      await CollectionRepo.calculationNewRelease()
      await CollectionRepo.calculationNewAdded()
      await CollectionRepo.calculationPopular()
    } catch (err) {
      Logger.error(err, 'Error in collectionCalculate')
      await this.sendAlertToAdmin(['Error in collectionCalculate', err.message])
    }
    Logger.info('Job collectionCalculate is finished')
    await this.sendAlertToAdmin(['Job collectionCalculate is finished'])
  }

  private async sendAlertToAdmin(messages: string[]) {
    const adminEmail = Env.get('ADMIN_EMAIL')
    if (_.isNil(adminEmail)) return

    const template = _.template(`
        ${messages.join('\n')}\n
        Created At: ${DateTime.now().toFormat('yyyy-MM-dd HH:mm')}
    `)

    await Mail.use('mailgun').send((message) => {
      message
        .from(
          Env.get('EMAIL_SENDER_EMAIL', 'no-reply@ponbook.net'),
          Env.get('EMAIL_SENDER_NAME', 'Ponbook Website')
        )
        .to(adminEmail)
        .subject('Hi Admin, Task is compeleted')
        .text(template(messages))
    })
  }
}
