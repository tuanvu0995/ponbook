import _ from 'lodash'
import { DateTime } from 'luxon'
import type { JobHandlerContract, Job } from '@ioc:Rlanz/Queue'
import Logger from '@ioc:Adonis/Core/Logger'
import CollectionRepo from 'App/Repos/CollectionRepo'
import Env from '@ioc:Adonis/Core/Env'
import View from 'App/Models/View'
import Video from 'App/Models/Video'
import Mail from '@ioc:Adonis/Addons/Mail'

export type summaryPayload = {}

export default class implements JobHandlerContract {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  public async handle(payload: summaryPayload) {
    try {
      Logger.info('Tasks is running')

      Logger.info("Sumaary view's task is running...")
      await this.summaryViews()
      Logger.info("Sumaary view's task is finished")

      Logger.info('Calculation New Released task is running...')
      await CollectionRepo.calculationNewRelease()
      Logger.info('Calculation New Released task is finished')

      Logger.info('Calculation New Added task is running...')
      await CollectionRepo.calculationNewAdded()
      Logger.info('Calculation New Added task is finished')

      Logger.info('Calculation Popular task is running...')
      await CollectionRepo.calculationPopular()

      Logger.info('Calculation Popular task is finished')
      Logger.info('Tasks is finished')
      await this.sendAlertToAdmin(['Tasks is finished'])
    } catch (err) {
      Logger.error(err, 'Error in run')
      await this.sendAlertToAdmin(['Error in run', err.message])
    }
  }

  public async summaryViews() {
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

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
