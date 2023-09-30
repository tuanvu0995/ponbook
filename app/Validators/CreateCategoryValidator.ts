import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateCategoryValidator {
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
    parentId: schema.number.optional(),
    name: schema.string({ trim: true }, [rules.maxLength(30), rules.minLength(3)]),
    description: schema.string({ trim: true }, [rules.maxLength(255), rules.minLength(3)]),
    calculationMethod: schema.enum(['manual', 'automatic'] as const),
    slug: schema.string.optional({ trim: true }, [rules.maxLength(30), rules.minLength(3)]),
    filters: schema.object.optional().members({
      tags: schema.array.optional().members(schema.string()),
      keywords: schema.array.optional().members(schema.string()),
    }),
    isPublished: schema.boolean.optional(),
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
