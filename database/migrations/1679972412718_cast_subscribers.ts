import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cast_subscribers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.integer('cast_id').unsigned().references('id').inTable('casts').onDelete('CASCADE')
      table
        .integer('user_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('name').nullable()
      table.string('email').nullable().unique().index()
      table.string('telegram_chat_id').nullable()

      table.boolean('verified').defaultTo(false)
      table.dateTime('verified_at').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['cast_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
