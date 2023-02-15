import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'
import SimpleWImg from 'App/Services/SimpleWImg'
import fs from 'fs'

export default class extends BaseSeeder {
  public async run() {
    const path = Env.get('LOCAL_UPLOAD_PATH')
    const imageUploadPath = `${path}/images`
    const files = fs.readdirSync(imageUploadPath)
    for (const file of files) {
      try {
        const filePath = imageUploadPath + '/' + file
        if (fs.lstatSync(filePath).isFile()) {
          await SimpleWImg(filePath)
        }
      } catch (err) {
        console.log('Error when process file: ' + err.message)
      }
    }
  }
}
