import { rules, schema as Schema, validator } from '@ioc:Adonis/Core/Validator'

export default async function validatePaginationQuery(data: { limit?: number; page?: number }) {
  const schema = Schema.create({
    limit: Schema.number.optional([rules.range(1, 50)]),
    page: Schema.number.optional(),
  })
  await validator.validate({ schema, data })
  return data
}
