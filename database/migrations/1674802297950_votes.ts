import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'votes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.bigInteger('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table
        .bigInteger('comment_id')
        .unsigned()
        .references('id')
        .inTable('comments')
        .onDelete('CASCADE')

      table.boolean('is_upvote').notNullable().defaultTo(false)
      table.boolean('is_downvote').notNullable().defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['user_id', 'post_id'])
      table.unique(['user_id', 'comment_id'])

      table.index(['user_id', 'post_id'])
      table.index(['user_id', 'comment_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
