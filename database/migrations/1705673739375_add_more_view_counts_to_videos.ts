import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('view_count_day').defaultTo(0).notNullable()
      table.bigInteger('view_count_week').defaultTo(0).notNullable()
      table.bigInteger('view_count_month').defaultTo(0).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('view_count_day')
      table.dropColumn('view_count_week')
      table.dropColumn('view_count_month')
    })
  }
}
