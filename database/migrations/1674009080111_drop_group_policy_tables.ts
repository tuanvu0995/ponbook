import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.dropTable('group_policies')
    this.schema.dropTable('user_policies')
    this.schema.dropTable('user_groups')
    this.schema.dropTable('groups')
    this.schema.dropTable('policies')
  }

  public async down() {}
}
