import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cast from 'App/Models/Cast'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const casts = await Cast.all()

    for (const cast of casts) {
      cast.favoriteCount = 2
      await cast.save()
    }
  }
}
