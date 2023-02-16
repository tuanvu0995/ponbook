import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
// import User from 'App/Models/User'

export default class ManagerPolicy extends BasePolicy {
  public async management(user: User) {
    return Boolean(user.superUser) || (await user.hasPermission('umr:admin/*'))
  }
}
