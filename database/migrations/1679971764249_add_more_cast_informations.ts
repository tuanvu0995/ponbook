import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'casts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('slug').notNullable().index()
      table.string('cup').nullable()
      table.string('jp_name').nullable()
      table.integer('favorite_count').defaultTo(0)
      table.integer('subscribed_count').defaultTo(0)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('slug', 'cup', 'jp_name', 'favorite_count', 'subscribed_count')
    })
  }
}
