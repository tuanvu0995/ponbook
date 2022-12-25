import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('uid').notNullable().unique().index()
      table.string('code').notNullable().defaultTo('').index()
      table.string('title').notNullable().defaultTo('')
      table.string('description').nullable()
      table.string('image').nullable()
      table.string('video').nullable()
      table.text('images').notNullable().defaultTo('[]')

      table.string('release_date').nullable()
      table.integer('duration').defaultTo(0)

      table.integer('cast_id').unsigned().references('id').inTable('casts').onDelete('CASCADE')
      table
        .integer('director_id')
        .unsigned()
        .references('id')
        .inTable('directors')
        .onDelete('CASCADE')
      table.integer('maker_id').unsigned().references('id').inTable('makers').onDelete('CASCADE')

      table.float('rate').defaultTo(0)
      table.integer('rate_count').defaultTo(0)
      table.integer('view_count').defaultTo(0)
      table.integer('comment_count').defaultTo(0)

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
