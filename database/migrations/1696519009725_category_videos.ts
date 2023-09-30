import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')

      table.index(['category_id', 'video_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
