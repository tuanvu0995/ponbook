import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactValidator from 'App/Validators/ContactValidator'
import Contact, { ContactStatus } from 'App/Models/Contact'
import Event from '@ioc:Adonis/Core/Event'

export default class ContactsController {
  public async store({ request, response }: HttpContextContract) {
    const body = await request.validate(ContactValidator)

    const ip = request.ip()
    const userAgent = request.header('user-agent')

    const contact = await Contact.create({
      ...body,
      status: ContactStatus.Pending,
      ipAddress: ip,
      userAgent,
    })

    Event.emit('contact:created', contact)

    return response.json({
      message:
        'Thank you for getting in touch! We appreciate you contacting us ponbook.net website. One of our colleagues will get back in touch with you soon!Have a great day!',
    })
  }
}
