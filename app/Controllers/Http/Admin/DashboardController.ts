import { DateTime } from 'luxon'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Visitor from 'App/Models/Visitor'

export default class DashboardController {
  public async index({ request, view }: HttpContextContract) {
    const { page = 1, limit = 30, bot = 'all' } = request.qs()
    const now = DateTime.now()
    const visitors = await Visitor.query()
      .where((qs) => {
        if (bot !== 'all') {
          qs.where('is_bot', bot === 'yes')
        }
      })
      .whereBetween('created_at', [now.startOf('day').toString(), now.endOf('day').toString()])
      .groupBy('path')
      .groupBy('ip_address')
      .orderBy('updated_at', 'desc')
      .select('*')
      .sum('count as total')
      .paginate(page, limit)

    const queryObject = request.qs() || {}
    visitors.baseUrl('/admin').queryString(queryObject)
    const totalVisitors = visitors.total
    return view.render('admin/dashboard', { visitors, today: now, totalVisitors, withBot: bot })
  }
}
