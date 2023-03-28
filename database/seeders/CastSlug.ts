import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cast from 'App/Models/Cast'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    let cast: Cast | null
    do {
      cast = await Cast.query().where('slug', '').first()
      if (cast) {
        cast.favoriteCount = 1
        await cast.save()
      }
    } while (cast)
  }
}
