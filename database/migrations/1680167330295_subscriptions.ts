import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.string('uid').notNullable().unique()

      table.integer('user_id').nullable()
      table.string('email').nullable()
      table.string('telegram_chat_id').nullable()

      table.string('event').notNullable()
      table.string('channel').notNullable()
      table.string('plan').notNullable()
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['id', 'is_deleted', 'is_active'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
