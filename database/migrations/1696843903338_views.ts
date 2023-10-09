import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'views'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.string('referer_type').notNullable()
      table.integer('referer_id').notNullable()
      table.integer('count').unsigned().defaultTo(0).notNullable()
      table.string('range').notNullable().defaultTo('day')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['referer_type', 'referer_id', 'range', 'created_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
