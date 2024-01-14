import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'clips'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('uid').notNullable().unique().index()
      table.text('caption').nullable()
      table.text('path').nullable()

      table.integer('views').unsigned().defaultTo(0)
      table.integer('likes').unsigned().defaultTo(0)
      table.integer('comments').unsigned().defaultTo(0)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['uid'])
      table.index(['uid', 'deleted_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
