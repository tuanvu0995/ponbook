import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class UpdateDuplicateCasts extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:duplicate_casts'

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
    const { default: Cast } = await import('App/Models/Cast')
    this.logger.info('Start scan duplicate casts')
    const casts = await Cast.query().select('id', 'name').orderBy('id', 'asc')

    for (const cast of casts) {
      const duplicate = await Cast.getCastByName(cast.name, [cast.id])
      if (duplicate) {
        this.logger.info(`Found duplicate cast: ${cast.id}, ${duplicate.id}`)
        const videos = await duplicate.related('videos').query().select('id')
        await cast.related('videos').attach(videos.map((video) => video.id))
        await duplicate.related('videos').detach()
        await duplicate.delete()
        this.logger.info(`Migrate videos to cast: ${cast.id}`)
      }
    }

    this.logger.info('Finish scan duplicate casts')
  }
}
