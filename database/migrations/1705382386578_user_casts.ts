import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users_casts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('cast_id').unsigned().references('id').inTable('casts').onDelete('CASCADE')

      table.boolean('can_notify').defaultTo(false)
      table.boolean('is_hidden').defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['user_id', 'cast_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
