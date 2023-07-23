import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    const tables = [
      'videos',
      'casts',
      'directors',
      'makers',
      'tags',
      'collections',
      'users',
      'roles',
      'pages',
      'permissions',
      'files',
      'contacts',
      'comments',
      'boxes',
      'settings',
      'subscriptions',
    ]

    for (const tableName of tables) {
      this.schema.alterTable(tableName, (table) => {
        table.timestamp('deleted_at', { useTz: true }).nullable()

        table.index(['id', 'deleted_at'])

        if (!['tags', 'settings', 'permissions', 'contacts', 'collections'].includes(tableName)) {
          table.index(['uid', 'deleted_at'])
        }
      })
    }
  }

  public async down() {}
}
