import generateUid from 'App/Helpers/generateUid'
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'

export default class UserRepo {
  public static async createTrackingUser() {
    const trackingId = generateUid()
    const user = await User.create({
      email: `tracker-${trackingId}@ponbook.net`,
      username: `tracker-${trackingId}`,
      password: trackingId,
      trackingId,
      totalPoints: 0,
    })

    Event.emit('user:tracker', user)

    return user
  }

  public static async findByTrackingId(trackingId: string) {
    const user = await User.query().where('tracking_id', trackingId).first()
    return user
  }
}
