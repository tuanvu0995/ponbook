import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpRequestPagination } from '@ioc:Contracts'
import NotFoundException from 'App/Exceptions/NotFoundException'

export default class NotificationsController {
  public async myNotifications({
    auth,
    response,
    pagination,
  }: HttpContextContract & HttpRequestPagination) {
    const user = auth.user!
    const notifications = await user
      .related('notifications')
      .query()
      .preload('user')
      .paginate(pagination.page, 30)
    return response.json(notifications)
  }

  public async markAsRead({ params, auth, response }: HttpContextContract) {
    const user = auth.user!
    const notification = await user
      .related('notifications')
      .query()
      .where('uid', params.uid)
      .first()
    if (!notification) {
      throw new NotFoundException('Notification not found')
    }

    notification.read = true
    await notification.save()
    return response.json(notification)
  }

  public async markAllAsRead({ auth, response }: HttpContextContract) {
    const user = auth.user!
    await user.related('notifications').query().where('read', false).update({ read: true })
    return response.json({ message: 'All notifications marked as read' })
  }
}
