import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class VideoCleanDuplicate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'video:clean_duplicate'

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
    this.logger.info('Starting video:clean_duplicate')
    const { default: Video } = await import('App/Models/Video')
    const items = await Video.query().groupBy('code').havingRaw('count(code) > 1')
    this.logger.info(`Found ${items.length} videos`)

    for (const item of items) {
      const videos = await Video.query()
        .preload('images')
        .preload('cover')
        .preload('image')
        .where('code', item.code)
        .orderBy('id', 'desc')
      // remove the first one
      videos.shift()
      for (const video of videos) {
        await video.related('tags').detach()
        await video.related('casts').detach()
        await video.related('comments').query().delete()
        await video.related('categories').detach()
        for (const image of video.images) {
          await image.delete()
        }
        await video.cover?.delete()
        await video.image?.delete()

        await video.delete()
      }
    }

    this.logger.info('Finished video:clean_duplicate')
  }
}
