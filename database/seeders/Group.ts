import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Group from 'App/Models/Group'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const groups = [
      { name: 'Admin', slug: 'admin', description: 'Admin group', policies: '*' },
      { name: 'Manager', slug: 'manager', description: 'Manager group', policies: '*' },
    ]

    await Group.createMany(groups)
  }
}
