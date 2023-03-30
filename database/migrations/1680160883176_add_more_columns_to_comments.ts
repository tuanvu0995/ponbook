import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').nullable()
      table.string('email').nullable()
      table.string('ip_address').nullable()
      table.text('user_agent').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('name', 'email', 'ip_address', 'user_agent')
    })
  }
}
