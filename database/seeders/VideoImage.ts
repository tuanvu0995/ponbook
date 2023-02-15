import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'
import SimpleWImg from 'App/Services/SimpleWImg'
import Video from 'App/Models/Video'
import { nanoid } from 'nanoid'

export default class extends BaseSeeder {
  public async run() {
    const path = Env.get('LOCAL_UPLOAD_PATH')

    let chunkNumber = 0
    let chunkLength = 0

    do {
      const videos = await Video.query()
        .where('is_published', true)
        .limit(100)
        .offset(chunkNumber * 100)
      chunkLength = videos.length

      for (const video of videos) {
        if (!video.code) continue
        try {
          if (video.cover) {
            const newCoverName = `images/${video.code}-cover-${nanoid()}.webp`
            await SimpleWImg(path + '/' + video.cover, path + '/' + newCoverName)
            video.cover = newCoverName
            await video.save()
          }

          if (video.images) {
            const newImages: string[] = []
            const images = JSON.parse(video.images)
            for (const image of images) {
              const filePath = path + '/' + image
              const newImageName = `images/${video.code}-${nanoid()}.webp`
              await SimpleWImg(filePath, path + '/' + newImageName)
              newImages.push(newImageName)
            }
            video.image = newImages[0]
            video.images = JSON.stringify(newImages)
            await video.save()
          }
          Logger.info('Done ', video.code)
        } catch (err) {
          Logger.warn(`ERROR WHEN CONVERTING ${video.code} COVER: ${err.message}`)
        }
      }
      chunkNumber += 1
    } while (chunkLength > 0)
  }
}
