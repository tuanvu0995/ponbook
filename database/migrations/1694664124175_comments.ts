import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')
      table.bigInteger('parent_id').nullable().unsigned().references('id').inTable('comments')

      table.string('uid', 30).notNullable().unique()

      table.string('title').nullable()
      table.text('content').notNullable()
      table.text('html_content').notNullable()

      table.boolean('is_published').defaultTo(false)

      table.bigInteger('view').unsigned().defaultTo(0)
      table.bigInteger('up_votes').unsigned().defaultTo(0)
      table.bigInteger('down_votes').unsigned().defaultTo(0)
      table.bigInteger('share_count').unsigned().defaultTo(0)
      table.bigInteger('comment_counts').unsigned().defaultTo(0)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('published_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['video_id', 'deleted_at'])
      table.index(['uid', 'deleted_at'])
      table.index(['parent_id', 'deleted_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
