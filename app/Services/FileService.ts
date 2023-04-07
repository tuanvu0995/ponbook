import { DateTime } from 'luxon'
import fs from 'fs'
import sharp from 'sharp'
import SizeOf from 'image-size'
import uniqid from 'uniqid'
import File from 'App/Models/File'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import retry from 'App/utils/retry'
import DownloadFile from './DownloadFile'

export default class FileService {
  private static readonly thumbnailTransform = { size: 50, fit: 'cover' }
  private static readonly imageTransform = { size: 1600, fit: 'cover' }

  public static async processImageFromUrl(imageUrl: string, prefix: string): Promise<File> {
    const fileData = await retry(
      async () => {
        return await DownloadFile(imageUrl)
      },
      { retriesCount: 3, delay: 1000 }
    )

    const filename = `tmp/${uniqid()}.jpg`
    await Drive.use('s3').put(filename, fileData)
    const path = Env.get('LOCAL_UPLOAD_PATH')

    return await FileService.processFile(path + '/' + filename, prefix)
  }

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

    await retry(
      async () => {
        const imageBuffer = await sharp(tmpPath)
          .resize(this.imageTransform.size, undefined, { fit: 'cover' })
          .webp()
          .toBuffer()
        await Drive.use('s3').put(file.path, imageBuffer, {
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
