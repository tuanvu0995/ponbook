import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'
import SimpleWImg from 'App/Services/SimpleWImg'
import Video from 'App/Models/Video'
import { nanoid } from 'nanoid'

export default class extends BaseSeeder {
  public async run() {
    const path = Env.get('LOCAL_UPLOAD_PATH')
    const imageUploadPath = `${path}/images`

    let chunkNumber = 0
    let chunkLength = 0

    do {
      const videos = await Video.query()
        .limit(100)
        .offset(chunkNumber * 100)
      chunkLength = videos.length

      for (const video of videos) {
        try {
          const newImages: string[] = []
          const images = JSON.parse(video.images)
          for (const image of images) {
            const filePath = imageUploadPath + '/' + image
            const newImageName = `${video.code}_${nanoid()}.webp`
            await SimpleWImg(filePath, imageUploadPath + '/' + newImageName)
            newImages.push(newImageName)
          }
          video.cover = newImages[0]
          video.images = JSON.stringify(newImages)
          await video.save()
        } catch (err) {
          console.log(`ERROR WHEN CONVERTING ${video.code} COVER: ${err.message}`)
        }
      }
      chunkNumber += 1
    } while (chunkLength > 0)
  }
}
