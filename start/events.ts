/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'

Event.on('user:created', 'User.onUserCreated')
Event.on('user:request-reset-link', 'User.onUserRequestResetLink')

Event.on('video:created', 'Video.onVideoCreated')
Event.on('video:updated', 'Video.onVideoUpdated')

Event.on('comment:created', 'Comment.onCommentCreated')

Event.on('email:sent', 'Email.onEmailSent')

Event.on('db:query', 'Db.onDbQuery')

Event.on('contact:created', 'Contact.onContactCreated')

Event.on('category:calculate', 'Category.calculate')

// Event.on('tracker:searched', 'Tracker.onSearched')
// Event.on('tracker:videoViewed', 'Tracker.onVideoViewed')

Event.on('task:run', 'Task.run')

Event.on('notification:created', 'Notification.onNotificationCreated')

/**
 * Points
 */
Event.on('point:reward', 'Point.onPointReward')
