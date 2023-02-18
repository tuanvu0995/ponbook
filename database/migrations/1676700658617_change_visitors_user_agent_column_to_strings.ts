import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // change column type
      table.string('user_agent').alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('user_agent').alter()
    })
  }
}
