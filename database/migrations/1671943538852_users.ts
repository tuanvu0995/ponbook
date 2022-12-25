import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('uid').unique().notNullable()
      table.string('email', 255).notNullable()
      table.string('username', 30).notNullable().defaultTo('')
      table.string('password', 180).nullable()
      table.string('remember_me_token').nullable()

      /**
       * Basic information
       */
      table.string('first_name', 30).nullable()
      table.string('last_name', 30).nullable()
      table.string('bio').nullable()
      table.string('birthday').nullable()
      table.string('gender').notNullable().defaultTo('other')

      /**
       * System information
       */
      table.boolean('super_user').notNullable().defaultTo(false)
      table.string('type').notNullable().defaultTo('member')
      table.string('account_status', 16).notNullable().defaultTo('pending')
      table.boolean('is_deleted').defaultTo(false)

      /**
       * Social information
       */
      table.string('social_provider').nullable()
      table.string('social_id').nullable()
      table.string('social_token').nullable()
      table.boolean('is_social_active').defaultTo(true)

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['uid'])
      table.index(['email'])
      table.index(['username'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
