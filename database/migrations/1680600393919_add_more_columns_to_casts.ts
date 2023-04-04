import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'casts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('image_file_id').unsigned().nullable().references('id').inTable('files')
      table.string('city_of_born').nullable()
      table.string('height').nullable()
      table.string('hobby').nullable()
      table.string('blood_type').nullable()
      table.string('skill').nullable()
      table.text('other').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('city_of_born')
      table.dropColumn('height')
      table.dropColumn('hobby')
      table.dropColumn('blood_type')
      table.dropColumn('skill')
      table.dropColumn('other')
    })
  }
}
