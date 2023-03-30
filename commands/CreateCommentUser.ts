import { BaseCommand } from '@adonisjs/core/build/standalone'
import uniqid from 'uniqid'

export default class CreateCommentUser extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'create:comment_user'

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
    const { default: User } = await import('App/Models/User')

    await User.create({
      firstName: 'Comment',
      lastName: 'San',
      email: 'commenter@ponbook.net',
      username: 'comment_san',
      password: uniqid(),
    })

    this.logger.info('Comment user created!')
  }
}
