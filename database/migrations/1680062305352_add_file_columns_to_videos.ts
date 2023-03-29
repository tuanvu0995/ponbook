import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('cover_file_id').unsigned().references('id').inTable('files')
      table.bigInteger('image_file_id').unsigned().references('id').inTable('files')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('cover_file_id', 'image_file_id')
    })
  }
}
