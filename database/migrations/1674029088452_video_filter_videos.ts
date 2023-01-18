import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'video_filter_videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table
        .bigInteger('video_filter_id')
        .unsigned()
        .references('id')
        .inTable('video_filters')
        .onDelete('CASCADE')
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')

      table.index(['video_filter_id', 'video_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
