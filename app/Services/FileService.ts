import { DateTime } from 'luxon'
import fs from 'fs'
import sharp from 'sharp'
import SizeOf from 'image-size'
import uniqid from 'uniqid'
import File from 'App/Models/File'
import Drive from '@ioc:Adonis/Core/Drive'
import retry from 'App/utils/retry'

export default class FileService {
  private static readonly thumbnailTransform = { size: 100, fit: 'cover' }

  public static async processFile(tmpPath: string, prefix: string): Promise<File> {
    const file = new File()
    const containDir = DateTime.now().toFormat('yyyy/MM/dd')
    file.name = `${prefix}-${uniqid()}.webp`
    file.path = `${containDir}/${file.name}`
    file.extension = 'webp'

    const stats = fs.statSync(tmpPath)
    file.size = stats.size
    const { width, height } = SizeOf(tmpPath)
    file.width = width || 0
    file.height = height || 0

    const stream = fs.createReadStream(tmpPath)

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
        const thumbnailBuffer = await sharp(tmpPath)
          .resize(size, undefined, { fit })
          .webp()
          .toBuffer()
        await Drive.use('s3').put(thumbnailPath, thumbnailBuffer)
        file.thumbnailPath = thumbnailPath
      },
      { retriesCount: 3, delay: 1000 }
    )

    await file.save()

    fs.unlinkSync(tmpPath)

    return file
  }
}
