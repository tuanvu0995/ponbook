import type { EventsList } from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/User'

export default class Point {
  public async onPointReward(point: EventsList['point:reward']) {
    const user = await User.query().where('id', point.userId).first()
    if (!user) {
      Logger.error('Event point:reward: User not found')
      return
    }

    let balance = 0
    const lastPoint = await user.related('points').query().orderBy('id', 'desc').first()
    if (lastPoint) {
      balance = lastPoint.totalPoints
    }

    const totalPoints = balance + point.amount
    await user.related('points').create({
      amount: point.amount,
      totalPoints,
      originPoints: balance,
      description: point.description || '',
      type: point.type,
    })

    user.totalPoints = totalPoints
    await user.save()

    Logger.info(`Event point:reward: User ${user.username} rewarded ${point.amount} points`)
  }
}
