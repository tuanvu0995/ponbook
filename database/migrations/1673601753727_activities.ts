import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'activities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.string('uid').notNullable().index().unique()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('related_type').notNullable().defaultTo('comment')
      table.bigInteger('related_id').unsigned()

      table.string('type').notNullable().defaultTo('up')
      table.integer('value').defaultTo(0)

      table.text('review').nullable()

      table.boolean('is_deleted').defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['user_id'])
      table.index(['user_id', 'type'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
