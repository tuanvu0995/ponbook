import _ from 'lodash'
import uniqid from 'uniqid'
import sharp from 'sharp'
import SizeOf from 'image-size'
import fs from 'fs'
import { BaseCommand } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import retry from '../app/utils/retry'
import { DateTime } from 'luxon'
import File from '../app/Models/File'
import Video from '../app/Models/Video'

export default class MigrationImage extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'migration:image'

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

  private readonly chunkSize = 100
  private readonly uploadPath = Env.get('LOCAL_UPLOAD_PATH')

  private chunkNumber = 0
  private chunkLength = 0

  private readonly thumbnailTransform = { size: 50, fit: 'cover' }

  public async run() {
    this.logger.info('[ImageMigration] Start migrating images')
    do {
      const chunks = await this.getChunks()
      this.chunkLength = chunks.length

      for (const video of chunks) {
        try {
          await this.migrateVideo(video)
        } catch (error) {
          this.logger.error(`[ImageMigration] Error: ${video.uid}, ${error.message}`)
        }
      }
    } while (this.chunkLength > 0)
    this.logger.success('[ImageMigration] Finish migrating images')
  }

  private async migrateVideo(video: Video) {
    const coverFile = await this.migrateCover(video.cover)
    await video.related('videoCover').associate(coverFile)

    const imageFile = await this.migrateImage(video.image)
    await video.related('videoImage').associate(imageFile)

    await video.related('images').attach([imageFile.id])

    video.version = 2
    await video.save()
    this.logger.debug(`[ImageMigration] Migrated: ${video.uid}`)
  }

  private async migrateCover(cover: string): Promise<File> {
    return await this.processFile(cover, 'cover')
  }

  private async migrateImage(image: string): Promise<File> {
    return await this.processFile(image, 'image')
  }

  private async getChunks(): Promise<Video[]> {
    const { default: Video } = await import('App/Models/Video')
    return await Video.query()
      .whereNot('version', 2)
      .whereNotNull('cover')
      .whereNotNull('image')
      .offset(this.chunkNumber * this.chunkSize)
      .limit(this.chunkSize)
      .select('id', 'uid', 'version', 'cover', 'image', 'images')
  }

  private async processFile(path: string, prefix: string): Promise<File> {
    const sourcePath = this.uploadPath + '/' + path
    const { default: File } = await import('App/Models/File')
    const file = new File()
    const containDir = DateTime.now().toFormat('yyyy/MM/dd')
    file.name = `${prefix}-${uniqid()}.webp`
    file.path = `${containDir}/${file.name}`
    file.extension = 'webp'

    const stats = fs.statSync(sourcePath)
    file.size = stats.size
    const { width, height } = SizeOf(sourcePath)
    file.width = width || 0
    file.height = height || 0

    const stream = await Drive.use('local').getStream(path)

    await retry(
      async () => {
        await Drive.use('s3').putStream(file.path, stream, {
          visibility: 'public',
        })
      },
      { retriesCount: 3, delay: 1000 }
    )

    await retry(
      async () => {
        const { size, fit } = this.thumbnailTransform
        const thumbnailPath = `${containDir}/${prefix}-${uniqid()}-thumbnail.webp`
        const thumbnailBuffer = await sharp(sourcePath)
          .resize(size, undefined, { fit })
          .webp()
          .toBuffer()
        await Drive.use('s3').put(thumbnailPath, thumbnailBuffer)
        file.thumbnailPath = thumbnailPath
      },
      { retriesCount: 3, delay: 1000 }
    )

    await file.save()

    return file
  }
}
