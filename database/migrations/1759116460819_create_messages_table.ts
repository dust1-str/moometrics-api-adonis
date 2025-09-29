import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('content').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('channel_id').unsigned().references('id').inTable('channels').onDelete('CASCADE')
      table.boolean('is_edited').defaultTo(false)
      table.timestamp('edited_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}