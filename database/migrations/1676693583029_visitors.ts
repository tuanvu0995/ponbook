import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.string('uid').notNullable().unique()
      table.string('ip_address')
      table.string('path')
      table.text('user_agent')
      table.string('method').nullable()
      table.text('headers').nullable()
      table.integer('count').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['ip_address', 'path', 'created_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
