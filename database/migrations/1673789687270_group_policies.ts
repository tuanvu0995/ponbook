import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'group_policies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.integer('group_id').unsigned().references('id').inTable('groups').onDelete('CASCADE')
      table.integer('policy_id').unsigned().references('id').inTable('policies').onDelete('CASCADE')
      table.boolean('is_recall').notNullable().defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['group_id', 'policy_id', 'is_recall'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
