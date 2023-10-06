import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('parent_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.string('uid', 30).notNullable().unique()
      table.string('name', 255).notNullable()
      table.string('slug', 255).notNullable()
      table.string('description', 255).nullable()
      table.string('calculation_method', 10).notNullable().defaultTo('manual')
      table.text('filters').nullable()
      table.text('breadcrumbs').nullable()
      table.boolean('is_published').notNullable().defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['slug', 'is_published', 'deleted_at'])
      table.index(['parent_id', 'is_published', 'deleted_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
