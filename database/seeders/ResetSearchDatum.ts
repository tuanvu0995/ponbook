import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VideoFilter from 'App/Models/VideoFilter'

export default class extends BaseSeeder {
  public async run() {
    await VideoFilter.query().delete()
  }
}
