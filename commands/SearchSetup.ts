import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class SearchSetup extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'search:setup'

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
    this.logger.info('Updating filterable attributes')
    const { default: MeiliSearch } = await import('@ioc:MeiliSearch')
    await MeiliSearch.updateFilterableAttributes('videos', ['code', 'title', 'casts', 'tags'])

    await MeiliSearch.updateSortableAttributes('videos', ['releaseDate', 'createdAt'])

    this.logger.info('Filterable attributes updated')
  }
}
