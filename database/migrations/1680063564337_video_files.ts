import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'video_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')
      table.bigInteger('file_id').unsigned().references('id').inTable('files').onDelete('CASCADE')

      table.index(['video_id', 'file_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
