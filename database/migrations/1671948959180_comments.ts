import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('uid').notNullable().unique().index()
      table.string('content').notNullable()
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')
      table.integer('parent_id').unsigned().references('id').inTable('comments').onDelete('CASCADE')
      table.boolean('is_reply').defaultTo(false)
      table.boolean('is_approved').defaultTo(false)
      table.boolean('is_blocked').defaultTo(false)

      table.integer('vote_up_count').defaultTo(0)
      table.integer('vote_down_count').defaultTo(0)

      table.text('attachment_images').notNullable().defaultTo('[]')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
