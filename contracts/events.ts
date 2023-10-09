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
import { SummaryViewPayload } from 'App/Jobs/SummaryView'

declare module '@ioc:Adonis/Core/Event' {
  /*
  |--------------------------------------------------------------------------
  | Define typed events
  |--------------------------------------------------------------------------
  |
  | You can define types for events inside the following interface and
  | AdonisJS will make sure that all listeners and emit calls adheres
  | to the defined types.
  |
  | For example:
  |
  | interface EventsList {
  |   'new:user': UserModel
  | }
  |
  | Now calling `Event.emit('new:user')` will statically ensure that passed value is
  | an instance of the the UserModel only.
  |
  */
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

    'job:summaryViews': SummaryViewPayload
  }
}
