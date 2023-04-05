import { BaseCommand } from '@adonisjs/core/build/standalone'
import fs from 'fs'

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
    // const { default: Database } = await import('@ioc:Adonis/Lucid/Database')
    this.logger.info('Start scan duplicate casts')

    const casts = await Cast.query().select('id', 'name').orderBy('id', 'asc')

    this.logger.info(`Found ${casts.length} casts`)
    function hasSpecialChars(name) {
      const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/
      return regex.test(name.replace(/\s/g, ''))
    }

    const updated: any[] = []

    let count = 0
    for (const cast of casts) {
      console.log(`Checking ${cast.name}...`)
      if (hasSpecialChars(cast.name)) {
        const newName = cast.name.replace(/[^a-zA-Z0-9 ]/g, '')
        console.log(`Updating to ${cast.name}...`)
        updated.push([cast.id, cast.name, newName])
        cast.name = newName
        await cast.save()
        count++
      }
    }

    fs.writeFileSync('casts.json', JSON.stringify(updated, null, 2))

    console.log('count: ', count)
  }
}
