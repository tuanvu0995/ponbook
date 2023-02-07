// import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
// import Video from 'App/Models/Video'
// import sharp from 'sharp'
// import Env from '@ioc:Adonis/Core/Env'
// import Application from '@ioc:Adonis/Core/Application'
// import Drive from '@ioc:Adonis/Core/Drive'

// export default class extends BaseSeeder {
//   public chunk = 0
//   public async run() {
//     // Write your database queries inside the run method
//     let videoLength = 0
//     do {
//       const videos = await Video.query()
//         .orderBy('id', 'asc')
//         .limit(100)
//         .offset(this.chunk * 100)
//       videoLength = videos.length

//       for (const video of videos) {
//         const images = JSON.parse(video.images)
//         const processedImages = []
//         for (const image of images) {
//           const data = await sharp(Application.appRoot + '/' + Env.get('LOCAL_UPLOAD_PATH') + image)
//             .webp()
//             .toBuffer()
//           const dist = image.replace('.jpg', '.webp')

//           await Drive.put(dist, data)
//           await Drive.delete(image)

//           processedImages.push(dist)

//         }
//         video.images = JSON.stringify(processedImages)
//       }
//       this.chunk++
//     } while (videoLength > 0)
//   }
// }
