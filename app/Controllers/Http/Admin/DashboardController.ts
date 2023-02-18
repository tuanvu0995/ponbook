import { DateTime } from 'luxon'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Visitor from 'App/Models/Visitor'

export default class DashboardController {
  public async index({ request, view }: HttpContextContract) {
    const { page = 1, limit = 20 } = request.qs()
    const now = DateTime.now()
    const visitors = await Visitor.query()
      .whereBetween('created_at', [now.startOf('day').toString(), now.endOf('day').toString()])
      .groupBy('path')
      .groupBy('ip_address')
      .orderBy('updated_at', 'desc')
      .select('*')
      .sum('count as total')
      .paginate(page, limit)

    visitors.baseUrl('/admin')
    return view.render('admin/dashboard', { visitors, today: now })
  }
}
