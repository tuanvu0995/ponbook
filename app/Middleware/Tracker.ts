import { isbot } from 'isbot'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRepo from 'App/Repos/UserRepo'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/User'

const COOKIE_TRACKING_ID = 'pb_tkid'

export default class Tracker {
  public async handle({ auth, request, session }: HttpContextContract, next: () => Promise<void>) {
    if (isbot(request.header('user-agent') || '')) {
      return await next()
    }

    if (!auth.user) {
      let tracker: User | null = null
      if (session.has(COOKIE_TRACKING_ID)) {
        // If the user has a tracking cookie, try to find the user
        tracker = await UserRepo.findByTrackingId(session.get(COOKIE_TRACKING_ID))
      } else {
        // If the user doesn't have a tracking cookie, create one
        tracker = await UserRepo.createTrackingUser()

        Logger.info(`Tracker user created: ${tracker?.uid}`)

        // Set the tracking cookie
        session.put(COOKIE_TRACKING_ID, tracker.trackingId!)
      }

      tracker && (await auth.login(tracker!))
      Logger.info(`Tracker user logged in: ${tracker?.uid}`)
    }

    await next()
  }
}
