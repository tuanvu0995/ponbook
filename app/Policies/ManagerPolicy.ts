import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
// import User from 'App/Models/User'

export default class ManagerPolicy extends BasePolicy {
  public async management() {
    return true
  }
}
