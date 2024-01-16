import { test } from '@japa/runner'

test('display home page', async ({ client }) => {
  const response = await client.get('/')

  console.log(response.text())

  response.assertStatus(200)
  response.assertTextIncludes('<title>Ponbook.net</title>')
})
