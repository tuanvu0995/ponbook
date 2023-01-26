import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.bigInteger('parent_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table.string('uid').notNullable().unique().index()
      table.string('title').nullable()
      table.text('content').notNullable()
      table.text('attachments').nullable()

      table.boolean('is_top').notNullable().defaultTo(false)
      table.boolean('is_published').notNullable().defaultTo(false)
      table.boolean('is_draft').notNullable().defaultTo(true)
      table.boolean('is_deleted').notNullable().defaultTo(false)

      table.integer('vote_up_count').notNullable().defaultTo(0)
      table.integer('vote_down_count').notNullable().defaultTo(0)
      table.integer('comments_count').notNullable().defaultTo(0)
      table.integer('views_count').notNullable().defaultTo(0)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['user_id'])
      table.index(['parent_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
