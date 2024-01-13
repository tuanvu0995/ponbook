/**
 * Contract source: https://git.io/JfefG
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import Comment from 'App/Models/Comment'
import Contact from 'App/Models/Contact'
import User from 'App/Models/User'
import Video from 'App/Models/Video'
import Category from 'App/Models/Category'
import Notification from 'App/Models/Notification'
import { PointType } from 'App/Models/Point'

declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'user:created': User
    'user:logged-in': User
    'video:created': Video
    'video:updated': Video
    'video:viewed': Video
    'comment:created': Comment
    'contact:created': Contact
    'category:calculate': Category
    'category:recalculate': undefined
    'tasks:summaryViews': undefined
    'notification:created': Notification
    'point:reward': {
      userId: number
      amount: number
      type: PointType
      description?: string
    }
    'search:searched': {
      term: string
      totalResults: number
    }
  }
}
