import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class RemoveUnusedFiles extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'remove:unused_files'

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
    const { default: File } = await import('App/Models/File')

    // unused files
    const files = await File.query()
      .whereNotExists((qs) => {
        qs.from('videos').whereColumn('videos.cover_file_id', 'files.id')
      })
      .whereNotExists((qs) => {
        qs.from('videos').whereColumn('videos.image_file_id', 'files.id')
      })
      .whereNotExists((qs) => {
        qs.from('video_files').whereColumn('video_files.file_id', 'files.id')
      })

    for (const file of files) {
      await file.delete()
    }
  }
}
