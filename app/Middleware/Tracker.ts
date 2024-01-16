import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRepo from 'App/Repos/UserRepo'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/User'

const COOKIE_TRACKING_ID = 'pb_tkid'

export default class Tracker {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user) {
      let tracker: User | null = null
      if (request.cookie(COOKIE_TRACKING_ID)) {
        // If the user has a tracking cookie, try to find the user
        tracker = await UserRepo.findByTrackingId(request.cookie(COOKIE_TRACKING_ID))
      } else {
        // If the user doesn't have a tracking cookie, create one
        tracker = await UserRepo.createTrackingUser()
        Logger.info(`Tracker user created: ${tracker?.uid}`)

        // Set the tracking cookie
        response.cookie(COOKIE_TRACKING_ID, tracker.trackingId)
      }

      await auth.login(tracker!)
      Logger.info(`Tracker user logged in: ${tracker?.uid}`)
    }

    await next()
  }
}
