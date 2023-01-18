import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

const defaultPermissions = [
  'umr:users/read:*',
  'umr:users/write:*',
  'umr:users/delete:*',
  'umr:users/*',
  'umr:videos/read:*',
  'umr:videos/write:*',
  'umr:videos/delete:*',
  'umr:videos/*',
  'umr:admin/*',
]

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    for (const permission of defaultPermissions) {
      const array = permission.split('/')
      const name = array[0].split(':')[0]
      const resource = array[0].split(':')[1]

      const secondArray = array[1].split(':')
      let scope = ''
      let action = ''
      if (secondArray.length === 1) {
        scope = secondArray[0]
      } else {
        scope = secondArray[1]
        action = secondArray[0]
      }

      if (await Permission.query().where('full_action', permission).first()) {
        continue
      }

      await Permission.create({
        name,
        resource,
        scope,
        action,
        fullAction: permission,
      })
    }

    const permissions = await Permission.query().where('is_deleted', false).select('id')
    const permissionIds = permissions.map((permission) => permission.id)

    const roles = await Role.query().where('is_deleted', false)
    for (const role of roles) {
      await role.related('permissions').sync(permissionIds)
    }

    const admin = await User.findBy('id', 1)
    if (admin) {
      await admin?.related('permissions').sync(permissionIds)
    } else {
      console.log('Admin user not found')
    }
  }
}
