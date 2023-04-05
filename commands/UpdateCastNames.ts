import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class UpdateCastNames extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:cast_names'

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

    const casts = await Cast.query()
      .select('id', 'name')
      .whereLike('name', '%(%')
      .orderBy('id', 'asc')

    for (const cast of casts) {
      const names = cast.name.split(' ')
      if (names.length <= 2) continue
      console.log('Cast: ', cast.id, cast.name)
    }
  }
}
