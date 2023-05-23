import _ from 'lodash'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import VisitorModel from 'App/Models/Visitor'
import DeviceDetector from 'device-detector-js'

export default class Visitor {
  public async onVisited(request: EventsList['visitor:visit']) {
    const { bot } = new DeviceDetector().parse(request.header('user-agent', ''))

    const excludes = [
      '/api',
      '/crawler',
      '/admin',
      '/account',
      '/login',
      '/logout',
      '/register',
      '/pop-link',
    ]
    const isExcluded = excludes.some((exclude) => request.url().startsWith(exclude))
    // check if path has file extension
    if (request.url().includes('.') || isExcluded) {
      return
    }

    const path = request.url(true)

    const data = {
      ip_address: request.ip(),
      user_agent: _.truncate(request.header('user-agent'), { length: 255 }),
      method: request.method(),
      headers: JSON.stringify(request.headers()),
      path,
      count: 1,
      country: request.header('cf-ipcountry')?.toLocaleLowerCase() || 'unknown',
      isBot: _.isObject(bot),
    }
    await VisitorModel.create(data)
  }
}
