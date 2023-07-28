import { BaseCommand } from '@adonisjs/core/build/standalone'
import axios from 'axios'

export default class MigrateVideo extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'migrate:video'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const { default: Video } = await import('App/Models/Video')

    const videos = await Video.query().where('release_date', 'undelivered now')

    console.log(videos.length)

    for (const video of videos) {
      console.log('Code', video.code)
      try {
        await axios.post(
          'https://worker.ponbook.net',
          {
            site: 'javlibrary',
            code: video.code,
            action: 'download',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-ponbook-worker-access-key': 'LHZMCZDSqpyu9eaLnTqYyEUHtRhkCn6p',
            },
          }
        )
      } catch (error) {
        console.log(error.response.data)
      }
    }
  }
}
