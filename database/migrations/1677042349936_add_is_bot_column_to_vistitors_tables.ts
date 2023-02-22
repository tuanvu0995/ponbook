import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_bot').defaultTo(false)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_bot')
    })
  }
}
