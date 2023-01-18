import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Video from 'App/Models/Video'

export default class VideoPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.superUser) {
      return true
    }
  }

  public async viewList(user: User) {
    return await user?.hasPermission('umr:videos/read:*')
  }
  public async view(user: User, video: Video) {
    return user.id === video.userId || (await user.hasPermission('umr:videos/read:*'))
  }
  public async create(user: User) {
    return user.accountStatus === 'active'
  }
  public async update(user: User, video: Video) {
    return user.id === video.userId || (await user.hasPermission('umr:videos/write:*'))
  }
  public async delete(user: User, video: Video) {
    return user.id === video.userId || (await user.hasPermission('umr:videos/delete:*'))
  }
}
