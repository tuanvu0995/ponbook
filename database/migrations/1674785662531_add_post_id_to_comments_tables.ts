import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table.index('post_id')
      table.index('post_id', 'parent_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('post_id')
    })
  }
}
