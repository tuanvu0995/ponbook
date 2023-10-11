import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'collection_videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')
      table
        .integer('collection_id')
        .unsigned()
        .references('id')
        .inTable('collections')
        .onDelete('CASCADE')

      table.index(['video_id', 'collection_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
