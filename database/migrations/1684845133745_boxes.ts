import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'boxes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('uid').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('name').notNullable()

      table.string('description').nullable()

      table.bigInteger('view_count').defaultTo(0)

      table.boolean('is_public').defaultTo(false)
      table.boolean('is_deleted').defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['uid'])
      table.index(['uid'])
      table.index(['user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
