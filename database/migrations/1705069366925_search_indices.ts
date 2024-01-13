import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'search_indices'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.string('term').notNullable().unique()
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['term'])
      table.index(['term', 'video_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
