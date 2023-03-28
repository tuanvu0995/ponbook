import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'video_filters'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('origin_keyword').nullable()
      table.text('search_params').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('origin_keyword', 'search_params')
    })
  }
}
