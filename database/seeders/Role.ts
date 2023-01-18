import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const roleData = [{ name: 'Admin', slug: 'admin', description: 'Admin role' }]

    const roles = await Role.createMany(roleData)
    const admin = await User.findBy('id', 1)
    if (admin) {
      await admin.related('roles').attach([roles[0].id])
    } else {
      console.log('Admin user not found')
    }
  }
}
