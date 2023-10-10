import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserRegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string([
      rules.unique({ table: 'users', column: 'username' }),
      rules.alphaNum(),
    ]),
    email: schema.string([rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string([rules.maxLength(60), rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'required': 'The {{ field }} is required to create a new account',
    'username.unique': 'The username is already taken',
    'email.unique': 'The email is already taken',
    'password.maxLength': 'The password must be less than 60 characters',
    'password.minLength': 'The password must be at least 8 characters',
    'username.alphaNum': 'The username must be alphanumeric',
  }
}
