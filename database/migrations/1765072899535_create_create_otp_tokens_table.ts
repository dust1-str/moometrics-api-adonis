import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'otp_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.string('token', 255).notNullable()
      table.boolean('is_valid').defaultTo(true).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}