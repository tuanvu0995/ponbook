import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'torrents'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('uid').unique().index()
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('magnet_url').nullable()
      table.text('torrent_file').nullable()
      table.integer('seed').defaultTo(0)
      table.integer('leech').defaultTo(0)
      table.integer('completed').defaultTo(0)
      table.text('info_hash').nullable()
      table.integer('size').notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index(['video_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
