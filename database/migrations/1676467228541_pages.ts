import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uid').unique().index()
      table.string('title').notNullable()
      table.string('slug').notNullable().index()
      table.text('content').notNullable()
      table.boolean('is_published').notNullable().defaultTo(false)
      table.string('layout').notNullable().defaultTo('default')

      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
