import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('data').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
