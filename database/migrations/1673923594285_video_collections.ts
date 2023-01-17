import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'video_collections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')
      table
        .integer('collection_id')
        .unsigned()
        .references('id')
        .inTable('collections')
        .onDelete('CASCADE')

      table.integer('order').defaultTo(0)

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
