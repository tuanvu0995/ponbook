import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.create({
      email: 'admin@example.com',
      username: 'admin',
      password: 'admin@123',
      firstName: 'foo',
      lastName: 'bar',
      superUser: true,
      type: 'admin',
      accountStatus: 'actived',
    })
  }
}
