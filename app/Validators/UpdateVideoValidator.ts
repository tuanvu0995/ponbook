import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateVideoValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    code: schema.string(),
    title: schema.string(),
    description: schema.string.optional(),
    director: schema.string.optional(),
    casts: schema.array.optional().members(schema.string()),
    tags: schema.array.optional().members(schema.string()),
    maker: schema.string.optional(),
    releaseDate: schema.string.optional(),
    duration: schema.number.optional(),
    cover: schema.object().members({
      path: schema.string(),
      data: schema.string(),
      size: schema.number(),
      width: schema.number(),
      height: schema.number(),
      type: schema.string(),
    }),
    image: schema.object().members({
      path: schema.string(),
      data: schema.string(),
      size: schema.number(),
      width: schema.number(),
      height: schema.number(),
      type: schema.string(),
    }),
    images: schema.array().members(
      schema.object().members({
        path: schema.string(),
        data: schema.string(),
        size: schema.number(),
        width: schema.number(),
        height: schema.number(),
        type: schema.string(),
      })
    ),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
