import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ads'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('uid').notNullable()
      table.string('area').notNullable()
      table.string('name').notNullable()
      table.string('site').notNullable()
      table.string('link').notNullable()
      table.string('image_url').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.boolean('is_deleted').notNullable().defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['uid'])
      table.index(['area', 'is_active', 'is_deleted'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
