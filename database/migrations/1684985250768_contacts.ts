import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('subject').notNullable()
      table.text('message').notNullable()
      table.string('status').defaultTo('pending')

      table.string('ip_address').nullable()
      table.text('user_agent').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['email'])
      table.index(['name'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
