import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'search_terms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.string('term').notNullable().unique()
      table.integer('total_results').unsigned().notNullable().defaultTo(0)
      table.bigInteger('count').notNullable().defaultTo(0)
      table.integer('last_day_count').unsigned().notNullable().defaultTo(0)
      table.integer('last_week_count').unsigned().notNullable().defaultTo(0)
      table.integer('last_month_count').unsigned().notNullable().defaultTo(0)
      table.bigInteger('last_year_count').unsigned().notNullable().defaultTo(0)

      table.boolean('is_hidden').notNullable().defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['term'])
      table.index(['term', 'deleted_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
