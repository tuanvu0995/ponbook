import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('uid', 300).notNullable().unique()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('type', 30).notNullable()
      table.string('title', 255).notNullable()
      table.text('content').nullable()
      table.text('data').nullable()
      table.text('link').nullable()
      table.boolean('read').defaultTo(false)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['uid'])
      table.index(['user_id'])
      table.index(['read', 'user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
