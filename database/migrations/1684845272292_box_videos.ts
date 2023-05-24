import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'box_videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.integer('box_id').unsigned().references('id').inTable('boxes').onDelete('CASCADE')
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['box_id', 'video_id'])
      table.index(['box_id', 'video_id'])
      table.index(['box_id'])
      table.index(['video_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
