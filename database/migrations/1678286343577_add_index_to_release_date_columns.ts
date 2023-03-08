import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['release_date'], 'release_date')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('release_date')
    })
  }
}
