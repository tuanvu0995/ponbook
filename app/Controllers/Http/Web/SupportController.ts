import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactValidator from 'App/Validators/ContactValidator'
import Contact, { ContactStatus } from 'App/Models/Contact'
import Event from '@ioc:Adonis/Core/Event'

export default class SupportController {
  public async sendContact({ request, response, session }: HttpContextContract) {
    session.flash('contact', {
      name: request.input('name'),
      email: request.input('email'),
      subject: request.input('subject'),
    })
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

    session.flash('success', 'Your message has been sent successfully.')

    return response.redirect().toRoute('web.contact')
  }
}
