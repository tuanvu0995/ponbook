import { BaseCommand } from '@adonisjs/core/build/standalone'
import File from 'App/Models/File'
import retry from 'App/Utils/retry'
import sharp from 'sharp'

export default class MigrateFile extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'migrate:file'

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
    console.log('Start')
    const { default: File } = await import('App/Models/File')

    const chunkSize = 100

    while (true) {
      const files = await File.query()
        .whereNull('data')
        .whereNotIn('id', [4405, 4793, 10559, 25281, 28724, 28935])
        .orderBy('id', 'desc')
        .limit(chunkSize)
      if (files.length === 0) break

      await Promise.all(files.map(this.processFile.bind(this)))
    }

    console.log('Done.')
  }

  private async processFile(file: File) {
    try {
      console.log(`Processing file ${file.uid}`)
      const { default: Drive } = await import('@ioc:Adonis/Core/Drive')

      const imageData = await Drive.use('s3').get(file.path)

      const resize = file.width > file.height ? 64 : 32

      const data = await sharp(imageData)
        .resize(resize, undefined, { fit: 'cover' })
        .webp({ quality: 60 })
        .toBuffer()

      await retry(
        async () => {
          await Drive.use('s3').delete(file.thumbnailPath)
          console.log('Successfully deleted thumbnailPath')
        },
        {
          retriesCount: 3,
          delay: 1000,
        }
      )

      file.data = data.toString('base64')
      file.thumbnailPath = ''
      await file.save()

      console.log(`Done processing file ${file.uid}`)
    } catch (error) {
      console.log(`Error processing file ${file.uid}`, error.message)
    }
  }
}
