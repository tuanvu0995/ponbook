import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.string('uid').notNullable().unique()
      table.string('name').notNullable()
      table.text('path').notNullable()
      table.text('thumbnail_path').notNullable()
      table.string('type').notNullable()
      table.string('extension').notNullable()
      table.integer('size').nullable().defaultTo(0)
      table.integer('width').nullable().defaultTo(0)
      table.integer('height').nullable().defaultTo(0)

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
