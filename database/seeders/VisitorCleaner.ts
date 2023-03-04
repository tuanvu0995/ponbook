import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Visitor from 'App/Models/Visitor'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    // remove all visitors older than 3 day
    const now = DateTime.now()
    const threeDaysAgo = now.minus({ days: 1 })
    const result = await Visitor.query()
      .where('is_bot', true)
      .where('created_at', '<', threeDaysAgo.toString())
      .delete()
    console.log(result)
  }
}
